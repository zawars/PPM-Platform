/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let projectsList = [];
let numberOfProjectsPerBusinessAreaWithOverallStatus = [];
let numberOfProjectsPerBusinessAreaWithCostStatus;
let numberOfProjectsPerBusinessAreaWithTimeStatus;
let numberOfProjectsPerBusinessAreaWithProjectType;
let numberOfProjectsPerBusinessUnitWithOverallStatus = [];
let projectsWithStrategicContribution = [];
let activeProjects = 0;
let totalBudget = 0;
let totalForecast = 0;
let onHoldProjects = 0;
let totalActualCosts = 0;
let overallStatusChart = [];
let projectsPerProjectTypeChart = [];
let opexVsCapexChart = [{
  name: 'OPEX',
  actual: 0,
  budget: 0,
  forecast: 0,
}, {
  name: 'CAPEX',
  actual: 0,
  budget: 0,
  forecast: 0,
}];
let businessUnitOptions = [];
let businessAreaOptions = [];
let projectTypeOptions = [];
let configuration;
let strategicContributionOptions;
let socketObj;

const io = SocketService.io;

io.on('connection', socket => {

  socketObj = socket;

  socket.on('dashboardProjectsIndex', data => {
    try {
      let paginated = SocketService.paginateArray(projectsList, data.pageSize, data.pageIndex);
      socket.emit('dashboardProjectsIndex', paginated)
    } catch (error) {
      ErrorsLogService.logError('Dasboard', error.toString(), 'dashboardProjectsIndex', '', socket.user.id);
    }
  });

  socket.on('dashboardProjectsFilter', async data => {
    let filters = data.filtersArray;
    let filtersObj = {};
    filters.forEach(filter => {
      let key = Object.keys(filter)[0];
      filtersObj[key] = filter[key];
    })

    await updateDropdownsValues();
    Reports.find(filtersObj).populateAll().then(reports => {
      projectsList = reports;
      calculateValues();
      calculateProjectsStatusValue();
      socket.emit('dashboardProjectsFilter', {
        overallStatusChart,
        numberOfProjectsPerBusinessUnitWithOverallStatus,
        numberOfProjectsPerBusinessAreaWithOverallStatus,
        opexVsCapexChart,
        projectsWithStrategicContribution,
        projectsPerProjectTypeChart,
        activeProjects,
        onHoldProjects,
        totalBudget,
        totalActualCosts,
        totalForecast,
        projectsList: SocketService.paginateArray(projectsList, 10, 1),
        projectsCount: projectsList.length
      });
    }).catch(err => {
      ErrorsLogService.logError('Dasboard', err.toString(), 'dashboardProjectsFilter', '', socket.user.id);
    })
  });
});


module.exports = {
  getDashboard: async (req, res) => {
    try {
      await updateDropdownsValues();
      Reports.find().populateAll().then(reports => {
        Configurations.findOne({ uid: 1 }).then(response => {
          configuration = response;
          projectsList = reports;
          calculateValues();
          calculateProjectsStatusValue();
          res.ok({
            overallStatusChart,
            numberOfProjectsPerBusinessUnitWithOverallStatus,
            numberOfProjectsPerBusinessAreaWithOverallStatus,
            opexVsCapexChart,
            projectsWithStrategicContribution,
            projectsPerProjectTypeChart,
            activeProjects,
            onHoldProjects,
            totalBudget,
            totalActualCosts,
            totalForecast,
            projectsCount: projectsList.length
          });
          socketObj.emit('dashboardProjects', SocketService.paginateArray(projectsList, 10, 1))
        }).catch(error => {
          ErrorsLogService.logError('Dasboard', error.toString(), 'getDashboardData', req);
        })
      }).catch(error => {
        ErrorsLogService.logError('Dasboard', error.toString(), 'getDashboardData', req);
      });
    } catch (error) {
      ErrorsLogService.logError('Dasboard', error.toString(), 'getDashboardData', req);
    }
  }
}

function calculateValues() { // Calculates all the data relating to charts
  totalBudget = 0;
  totalActualCosts = 0;
  totalForecast = 0;
  initializeValues();

  projectsList.forEach(project => { // Iterating Projects list
    if (project.costTypeTable) {
      // Calculating cost values in Dashboard Cards at top position in page
      totalBudget += (project.costTypeTable[6].currentBudget * configuration.rates[project.currency]);
      totalActualCosts += (project.costTypeTable[6].actualCost * configuration.rates[project.currency]);
      totalForecast += (project.costTypeTable[6].forecast * configuration.rates[project.currency]);
    }

    project.statusReports.forEach((statusObj, index) => {
      if (index == project.statusReports.length - 1) {
        // Overall Status Chart calculation
        if (statusObj.overallStatus == 'Green') {
          overallStatusChart[0].value++;
        } else if (statusObj.overallStatus == 'Yellow') {
          overallStatusChart[1].value++;
        } else if (statusObj.overallStatus == 'Red') {
          overallStatusChart[2].value++;
        }
      }
    });

    //Number of Projects per Business Area
    if (businessAreaOptions.values != undefined) {
      businessAreaOptions.values.forEach((areaObj, index) => {
        if (project.businessArea != undefined) {
          if (project.businessArea.name == areaObj.name) {
            numberOfProjectsPerBusinessAreaWithOverallStatus[index].areaCount++;
            calculateOverallStatusStacked(project.statusReports, index);
            calculateCostStatusStacked(project.statusReports, index);
            calculateTimeStatusStacked(project.statusReports, index);
          }
        }
      });
    }

    //Number of Projects per Business Unit
    businessUnitOptions.values.forEach((unitObj, index) => {
      if (project.businessUnit != undefined) {
        if (project.businessUnit.name == unitObj.name) {
          numberOfProjectsPerBusinessUnitWithOverallStatus[index].areaCount++;
          calculateOverallStatusForBusinessUnitStacked(project.statusReports, index);
        }
      }
    });

    //Number of Projects per Project Type
    projectTypeOptions.values.forEach((obj, index) => {
      if (project.projectType != undefined) {
        if (project.projectType.name == obj.name) {
          projectsPerProjectTypeChart[index].value++;
        }
      }
    });

    //OPEX vs CAPEX Chart
    if (project.costTypeTable != undefined) {
      opexVsCapexChart[0].actual += project.costTypeTable[0].actualCost * 1 + project.costTypeTable[1].actualCost * 1;
      opexVsCapexChart[0].forecast += project.costTypeTable[0].forecast * 1 + project.costTypeTable[1].forecast * 1;
      opexVsCapexChart[0].budget += project.costTypeTable[0].currentBudget * 1 + project.costTypeTable[1].currentBudget * 1;
      opexVsCapexChart[1].actual += project.costTypeTable[2].actualCost * 1 + project.costTypeTable[3].actualCost * 1;
      opexVsCapexChart[1].forecast += project.costTypeTable[2].forecast * 1 + project.costTypeTable[3].forecast * 1;
      opexVsCapexChart[1].budget += project.costTypeTable[2].currentBudget * 1 + project.costTypeTable[3].currentBudget * 1;
    }


    //Projects with Strategic Contribution Calculation
    strategicContributionOptions.values.forEach((element, index) => {
      if (project.strategicContribution != undefined) {
        if (project.strategicContribution.name == element.name) {
          projectsWithStrategicContribution[index].value++;
        }
      }
    });
  });

  totalBudget = parseFloat(totalBudget.toFixed(2)) / 1000000;
  totalActualCosts = parseFloat(totalActualCosts.toFixed(2)) / 1000000;
  totalForecast = parseFloat(totalForecast.toFixed(2)) / 1000000;
}

function initializeValues() {
  statusOptions = ['Active', 'On Hold', 'Closed'];
  subProjectsOptions = ['Include', 'Exclude'];
  opexVsCapexChart = [{
    name: 'OPEX',
    actual: 0,
    budget: 0,
    forecast: 0,
  }, {
    name: 'CAPEX',
    actual: 0,
    budget: 0,
    forecast: 0,
  }];

  onHoldProjects = 0;
  activeProjects = 0;

  overallStatusChart = [
    {
      status: 'Grün',
      value: 0
    }, {
      status: 'Gelb',
      value: 0
    }, {
      status: 'Rot',
      value: 0
    }];

  costStatusChart = [
    {
      status: 'Green',
      value: 0
    }, {
      status: 'Yellow',
      value: 0
    }, {
      status: 'Red',
      value: 0
    }
  ];

  timeStatusChart = [
    {
      status: 'Green',
      value: 0
    }, {
      status: 'Yellow',
      value: 0
    }, {
      status: 'Red',
      value: 0
    }
  ];

  riskStatusChart = [
    {
      status: 'Green',
      value: 0
    }, {
      status: 'Yellow',
      value: 0
    }, {
      status: 'Red',
      value: 0
    }
  ];

  resourceStatusChart = [
    {
      status: 'Green',
      value: 0
    }, {
      status: 'Yellow',
      value: 0
    }, {
      status: 'Red',
      value: 0
    }
  ];

  projectsPerBusinessAreaChart = [
    {
      name: 'Energy',
      value: 0
    }, {
      name: 'Grids (Netze)',
      value: 0
    }, {
      name: 'Services',
      value: 0
    }, {
      name: 'Others',
      value: 0
    },
  ];

  applyFilterButtonOptions = {
    text: "Apply",
    onClick: (e) => {
      popupVisible = false;
    }
  };

  cancelButtonOptions = {
    text: "Cancel",
    onClick: (e) => {
      popupVisible = false;
    }
  };

  numberOfProjectsPerBusinessAreaWithCostStatus = [
    {
      area: "Energy",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Grids (Netze)",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Services",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Others",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }
  ];

  numberOfProjectsPerBusinessAreaWithTimeStatus = [
    {
      area: "Energy",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Grids (Netze)",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Services",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }, {
      area: "Others",
      red: 0,
      green: 0,
      areaCount: 0,
      yellow: 0
    }
  ];

  numberOfProjectsPerBusinessAreaWithProjectType = [
    {
      area: "Energy",
      areaCount: 0,
      projectTypeCount: 0
    }, {
      area: "Grids (Netze)",
      areaCount: 0,
      projectTypeCount: 0
    }, {
      area: "Services",
      areaCount: 0,
      projectTypeCount: 0
    }, {
      area: "Others",
      areaCount: 0,
      projectTypeCount: 0
    }
  ];
}

function updateDropdownsValues() {
  Dropdown.find().populate('values').then(dropdowns => {
    dropdowns.forEach(element => {
      if (element.field == "Mandatory Projects") {
        mandatoryProjectOptions = element;
      } else if (element.field == "Business Area") {
        businessAreaOptions = element;
      } else if (element.field == "Business Unit") {
        businessUnitOptions = element;
      } else if (element.field == "Business Segment") {
        businessSegmentOptions = element;
      } else if (element.field == "Reporting Level") {
        reportingLevelOptions = element;
      } else if (element.field == "Classification") {
        classificationOptions = element;
      } else if (element.field == "Project Type") {
        projectTypeOptions = element;
      } else if (element.field == "Strategic Contribution") {
        strategicContributionOptions = element;
      } else if (element.field == "Profitability") {
        profitabilityOptions = element;
      } else if (element.field == "Feasibility") {
        feasibilityOptions = element;
      } else if (element.field == "Project Phase") {
        projectPhaseOptions = element;
      } else if (element.field == "Risk Strategy") { //'Strategy'
        risksTopFiveRiskStrategySelectOptions = element;
      } else if (element.field == "Decision Type") {
        decisionTypeOptions = element;
      } else if (element.field == "Document Type") {
        typeOptions = element;
      } else if (element.field == "Project Methodology") {
        projectMethodologyOptions = element;
      } else if (element.field == "Lesson Category") {
        lessonsCategoryOptions = element;
      } else if (element.field == "Impact") {
        impactOptions = element;
      } else if (element.field == "Digitalization Topic") {
        digitalizationTopicOptions = element;
      } else if (element.field == "Technology") {
        technologyOptions = element;
      } else if (element.field == "Digitalization Focus") {
        digitalizationFocusOptions = element;
      } else if (element.field == "Digitalization Degree") {
        digitalizationDegreeOptions = element;
      } else if (element.field == "IT Relevant") {
        itRelevantOptions = element;
      }
    });


    numberOfProjectsPerBusinessAreaWithOverallStatus = [];

    businessAreaOptions.values.forEach(area => {
      numberOfProjectsPerBusinessAreaWithOverallStatus.push({
        area: area.name,
        red: 0,
        green: 0,
        areaCount: 0,
        yellow: 0
      });
    });

    projectsPerProjectTypeChart = [];
    projectTypeOptions.values.forEach(area => {
      projectsPerProjectTypeChart.push({
        name: area.name,
        value: 0
      });
    });

    numberOfProjectsPerBusinessUnitWithOverallStatus = [];
    businessUnitOptions.values.forEach(area => {
      numberOfProjectsPerBusinessUnitWithOverallStatus.push({
        area: area.name,
        red: 0,
        green: 0,
        areaCount: 0,
        yellow: 0
      });
    });

    projectsWithStrategicContribution = [];

    strategicContributionOptions.values.forEach(area => {
      projectsWithStrategicContribution.push({
        area: area.name,
        value: 0
      });
    });
  }).catch(error => {
    ErrorsLogService.logError('Dasboard', error.toString(), 'dashboardProjectsFilter');
  })
}

function calculateOverallStatusStacked(reports, idx) {
  reports.forEach((element, index) => {
    if (index == reports.length - 1) {
      if (idx < numberOfProjectsPerBusinessAreaWithCostStatus.length) {
        if (element.overallStatus == 'Green') {
          numberOfProjectsPerBusinessAreaWithOverallStatus[idx].green++;
        } else if (element.overallStatus == 'Yellow') {
          numberOfProjectsPerBusinessAreaWithOverallStatus[idx].yellow++;
        } else if (element.overallStatus == 'Red') {
          numberOfProjectsPerBusinessAreaWithOverallStatus[idx].red++;
        }
      }
    }
  });
}

function calculateProjectsStatusValue() { //Calculates how many projects are active and on hold
  projectsList.forEach(project => {
    if (project.status == "Active") {
      activeProjects++;
    } else if (project.status == "On Hold") {
      onHoldProjects++;
    }
  });
}

function calculateCostStatusStacked(reports, idx) {
  reports.forEach((element, index) => {
    if (index == reports.length - 1) {
      if (idx < numberOfProjectsPerBusinessAreaWithCostStatus.length) {
        if (element.costStatus == 'Green') {
          numberOfProjectsPerBusinessAreaWithCostStatus[idx].green++;
        } else if (element.costStatus == 'Yellow') {
          numberOfProjectsPerBusinessAreaWithCostStatus[idx].yellow++;
        } else if (element.costStatus == 'Red') {
          numberOfProjectsPerBusinessAreaWithCostStatus[idx].red++;
        }
      }
    }
  });
}

function calculateTimeStatusStacked(reports, idx) {
  reports.forEach((element, index) => {
    if (index == reports.length - 1) {
      if (idx < numberOfProjectsPerBusinessAreaWithCostStatus.length) {
        if (element.timeStatus == 'Green') {
          numberOfProjectsPerBusinessAreaWithTimeStatus[idx].green++;
        } else if (element.timeStatus == 'Yellow') {
          numberOfProjectsPerBusinessAreaWithTimeStatus[idx].yellow++;
        } else if (element.timeStatus == 'Red') {
          numberOfProjectsPerBusinessAreaWithTimeStatus[idx].red++;
        }
      }
    }
  });
}

function calculateOverallStatusForBusinessUnitStacked(reports, idx) {
  reports.forEach((element, index) => {
    if (index == reports.length - 1) { //For Last report only
      if (element.overallStatus == 'Green') {
        numberOfProjectsPerBusinessUnitWithOverallStatus[idx].green++;
      } else if (element.overallStatus == 'Yellow') {
        numberOfProjectsPerBusinessUnitWithOverallStatus[idx].yellow++;
      } else if (element.overallStatus == 'Red') {
        numberOfProjectsPerBusinessUnitWithOverallStatus[idx].red++;
      }
    }
  });
}

