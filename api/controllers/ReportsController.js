/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

  console.log('socket', socket.id)

  //To get count
  socket.on('portfolioProjectsCount', async data => {
    let count = await Reports.count({ user: data.userId });
    socket.emit('portfolioProjectsCount', count);
    console.log('count', count)
  });

  //To paginate
  socket.on('portfolioProjectsIndex', data => {
    Reports.find({
      user: data.userId
    })
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(projects => {
        socket.emit('portfolioProjectsIndex', projects);
      })
      .catch(error => {
        socket.emit('portfolioProjectsIndex', error);
      });
  });

  //To search in data table of Projects
  socket.on('portfolioProjectsSearch', async data => {
    let search = data.search.toLowerCase();
    let count = 0;

    try {
      await Reports.find({ user: data.userId }).populateAll().then(projects => {
        let filteredProjects = projects.filter(project => {
          let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search)
            || (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search))
            || (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search))
            || (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search))
            || (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search))
            || project.status.toLowerCase().includes(search);

          return check;
        })
        count = filteredProjects.length;
      });

      Reports.find({ user: data.userId }).populateAll().then(projects => {
        let filteredProjects = projects.filter(project => {
          let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search)
            || (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search))
            || (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search))
            || (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search))
            || (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search))
            || project.status.toLowerCase().includes(search);

          return check;
        })
        let paginatedProjects = SocketService.paginateArray(filteredProjects, 20, 1);
        socket.emit('portfolioProjectsSearch', { count: count, projects: paginatedProjects });
      });
    } catch (error) {
      console.log(error);
    }
  });

  //To paginate search results of projects
  socket.on('portfolioProjectsSearchIndex', data => {
    let search = data.search;

    Reports.find({ user: data.userId }).populateAll().then(projects => {
      let filteredProjects = projects.filter(project => {
        let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search)
          || (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search))
          || (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search))
          || (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search))
          || (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search))
          || project.status.toLowerCase().includes(search);

        return check;
      })
      let paginatedProjects = SocketService.paginateArray(filteredProjects, data.pageSize, data.pageIndex);
      socket.emit('portfolioProjectsSearchIndex', paginatedProjects);
    });
  });

  socket.on('portfolioProjectsFilter', data => {
    let filters = data.filtersArray;
    let filtersObj = {};
    let count = 0;
    filters.forEach(filter => {
      let key = Object.keys(filter)[0];
      filtersObj[key] = filter[key];
    })

    Reports.find({ user: data.userId }).where(filtersObj).populateAll().then(projects => {
      let paginatedProjects = SocketService.paginateArray(projects, 20, 1);
      socket.emit('portfolioProjectsFilter', { count: projects.length, projects: paginatedProjects });
    })
  });

  socket.on('portfolioProjectsFilterIndex', data => {
    let filters = data.filtersArray;
    let filtersObj = {}
    filters.forEach(filter => {
      let key = Object.keys(filter)[0];
      filtersObj[key] = filter[key];
    })
    Reports.find({ user: data.userId }).where(filtersObj).populateAll().then(projects => {
      let paginatedProjects = SocketService.paginateArray(projects, data.pageSize, data.pageIndex);
      socket.emit('portfolioProjectsFilterIndex', paginatedProjects);
    })
  });

});


module.exports = {
  getReportsByUser: (req, res) => {
    Reports.find({
      user: req.params.id
    }).populate('user').then(reports => {
      res.ok(reports);
    });
  },

  getTeamReportsByUser: (req, res) => {
    Reports.find().populate('user').populate('project').populate('team').then(reports => {
      // res.ok(reports);
      let resultReports = [];
      reports.forEach((report, index) => {
        if (report.team) {
          let arr = report.team.forEach((obj) => {
            if (obj.name.id == req.params.id) {
              resultReports.push(report);
            }
          });
        }
      });
      res.ok(resultReports);
    });
  },

  budgetImport: async (req, res) => {
    let data = req.body;
    const fs = require('fs');
    const XLSX = require('xlsx');

    let workbook = XLSX.readFile(process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + '\\' + data.path);
    let sheet_name_list = workbook.SheetNames;
    let currentYearBudgetResult = XLSX.utils.sheet_to_json(workbook.Sheets['Project Budget Current Year']);
    let result = XLSX.utils.sheet_to_json(workbook.Sheets['Project Budget Next Year']);
    let actualCostTableResult = XLSX.utils.sheet_to_json(workbook.Sheets['Project Actual Budget']);
    let currentYearSubPortfolioTableResult = XLSX.utils.sheet_to_json(workbook.Sheets['Sub-Port Budget Current Year']);
    let nextYearSubPortfolioTableResult = XLSX.utils.sheet_to_json(workbook.Sheets[`Sub-Port Budget Next Year`]);

    let budgetPlanningTable2;
    for (let i = 0; i < result.length; i += 7) {
      if (result[i]) {
        // Project Next Year Budget
        let reportObj1 = await Reports.findOne({
          uid: result[i].projectId
        });

        if (reportObj1.budgetPlanningTable2) {
          budgetPlanningTable2 = reportObj1.budgetPlanningTable2;
        }

        if (budgetPlanningTable2) {
          budgetPlanningTable2.forEach((val, idx) => {
            val.budget = result[i + idx].budget;
            val.thereofICT = result[i + idx].thereofICT
          });
        } else {
          budgetPlanningTable2 = [];
          for (let j = i; j < i + 7; j++) {
            budgetPlanningTable2.push({
              costType: result[j].costType,
              budget: result[j].budget,
              id: result[j].id,
              group: result[j].group,
              thereofICT: result[j].thereofICT,
            });
          }
        }

        await Reports.update({
          uid: result[i].projectId
        }).set({
          budgetPlanningTable2
        });
        budgetPlanningTable2 = [];
      }
    }

    // Project Current Year Budget
    for (let i = 0; i <= currentYearBudgetResult.length; i += 7) {
      if (currentYearBudgetResult[i]) {
        let reportObj2 = await Reports.findOne({
          uid: currentYearBudgetResult[i].projectId
        });
        let budgetPlanningTable1 = reportObj2.budgetPlanningTable1;

        if (budgetPlanningTable1) {
          budgetPlanningTable1.forEach((val, idx) => {
            val.actualCost = currentYearBudgetResult[i + idx].actualCost;
          });
        }

        await Reports.update({
          uid: currentYearBudgetResult[i].projectId
        }).set({
          budgetPlanningTable1
        });
      }
    }

    // Project Actual Budget
    for (let i = 0; i <= actualCostTableResult.length; i += 7) {
      if (actualCostTableResult[i]) {
        let reportObj3 = await Reports.findOne({
          uid: actualCostTableResult[i].projectId
        });
        let actualCostTable = reportObj3.actualCostTable;

        if (actualCostTable) {
          actualCostTable.forEach((val, idx) => {
            val.actualCost = actualCostTableResult[i + idx].actualCost;
          });
        }

        await Reports.update({
          uid: actualCostTableResult[i].projectId
        }).set({
          actualCostTable
        });
      }
    }

    // Sub-Portfolio Current Year Budget
    for (let i = 0; i <= currentYearSubPortfolioTableResult.length; i += 7) {
      if (currentYearSubPortfolioTableResult[i]) {
        let portfolioObj = await Portfolio.findOne({
          id: currentYearSubPortfolioTableResult[i].portfolioId
        });
        let subPortfolioBudgetingList = portfolioObj.subPortfolioBudgetingList;

        let length = subPortfolioBudgetingList.length;
        if (subPortfolioBudgetingList) {
          for (let j = 0; j < length; j++) {
            subPortfolioBudgetingList[j].pspCurrentYear = currentYearSubPortfolioTableResult[i].pspCurrentYear;
            if (subPortfolioBudgetingList[j].subPortfolioBudgetCurrentYear) {
              subPortfolioBudgetingList[j].subPortfolioBudgetCurrentYear.forEach((obj, index) => {
                obj.budget = currentYearSubPortfolioTableResult[i + index].budget;
                obj.thereofICT = currentYearSubPortfolioTableResult[i + index].thereofICT;
              });
            }

            if (j < length - 1) { // In order to loop for all sub portfolios and also to skip the portion of their data in excel
              i += 7;
            }
          }
        }

        await Portfolio.update({
          id: currentYearSubPortfolioTableResult[i].portfolioId
        }).set({
          subPortfolioBudgetingList
        });
      }
    }

    // Sub-Portfolio Next Year Budget
    let subPortfolioBudgetingList;
    for (let i = 0; i < nextYearSubPortfolioTableResult.length; i += 7) {
      if (nextYearSubPortfolioTableResult[i]) {
        let portfolioObj = await Portfolio.findOne({
          id: nextYearSubPortfolioTableResult[i].portfolioId
        });
        subPortfolioBudgetingList = portfolioObj.subPortfolioBudgetingList;

        let length = subPortfolioBudgetingList.length;
        if (subPortfolioBudgetingList) {
          for (let j = 0; j < length; j++) {
            subPortfolioBudgetingList[j].pspNextYear = nextYearSubPortfolioTableResult[i].pspNextYear;
            if (subPortfolioBudgetingList[j].subPortfolioBudgetNextYear) {
              subPortfolioBudgetingList[j].subPortfolioBudgetNextYear.forEach((obj, index) => {
                obj.budget = nextYearSubPortfolioTableResult[i + index].budget;
                obj.thereofICT = nextYearSubPortfolioTableResult[i + index].thereofICT;
              });
            }

            if (j < length - 1) { // In order to loop for all sub portfolios and also to skip the portion of their data in excel
              i += 7;
            }
          }
        }

        await Portfolio.update({
          id: nextYearSubPortfolioTableResult[i].portfolioId
        }).set({
          subPortfolioBudgetingList
        });
        subPortfolioBudgetingList = [];
      }
    }

    fs.unlink(process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + '\\' + data.path, function (err) {
      if (err) return console.log(err); // handle error as you wish
      res.ok({
        message: 'Data Imported successfully.'
      });
    });
  },

  budgetSwitch: async (req, res) => {
    let reports = await Reports.find({
      status: 'Active'
    });

    reports.map(async report => {
      await Reports.update({
        status: 'Active',
        id: report.id
      }).set({
        budgetPlanningTable1: report.budgetPlanningTable2,
        budgetPlanningTable2: undefined
      });
    });

    let portfolios = await Portfolio.find({
      status: 'Active'
    });
    portfolios.map(async portfolio => {
      if (portfolio.portfolioBudgetingList) {
        if (portfolio.portfolioBudgetingList.portfolioBudgetCurrentYear) {
          portfolio.portfolioBudgetingList.portfolioBudgetCurrentYear.forEach((val, idx) => {
            val.budget = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].budget;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].budget = '';
            val.thereofICT = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].thereofICT;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].thereofICT = '';
            val.assigned = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].assigned;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].assigned = '';
            val.remaining = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remaining;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remaining = '';
            val.remainingPercent = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remainingPercent;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remainingPercent = '';
          });
        }
      }

      if (portfolio.subPortfolioBudgetingList) {
        portfolio.subPortfolioBudgetingList.forEach(budgetObj => {
          budgetObj.pspCurrentYear = budgetObj.pspNextYear;
          budgetObj.pspNextYear = '';
          budgetObj.subPortfolioBudgetCurrentYear.forEach((val, idx) => {
            if (budgetObj.subPortfolioBudgetNextYear) {
              val.budget = budgetObj.subPortfolioBudgetNextYear[idx].budget;
              budgetObj.subPortfolioBudgetNextYear[idx].budget = '';
              val.thereofICT = budgetObj.subPortfolioBudgetNextYear[idx].thereofICT;
              budgetObj.subPortfolioBudgetNextYear[idx].thereofICT = '';
              val.assigned = budgetObj.subPortfolioBudgetNextYear[idx].assigned;
              budgetObj.subPortfolioBudgetNextYear[idx].assigned = '';
              val.remaining = budgetObj.subPortfolioBudgetNextYear[idx].remaining;
              budgetObj.subPortfolioBudgetNextYear[idx].remaining = '';
              val.remainingPercent = budgetObj.subPortfolioBudgetNextYear[idx].remainingPercent;
              budgetObj.subPortfolioBudgetNextYear[idx].remainingPercent = '';
            }
          });
        });
      }

      await Portfolio.update({
        status: 'Active',
        id: portfolio.id
      }).set({
        portfolioBudgetingList: portfolio.portfolioBudgetingList,
        subPortfolioBudgetingList: portfolio.subPortfolioBudgetingList,
      });
    });

    let programs = await Program.find({
      status: 'Active'
    });
    programs.map(async program => {
      if (program.programBudgetCurrentYear) {
        program.programBudgetCurrentYear.forEach((val, idx) => {
          if (program.programBudgetNextYear) {
            val.budget = program.programBudgetNextYear[idx].budget;
            program.programBudgetNextYear[idx].budget = '';
            val.assigned = program.programBudgetNextYear[idx].assigned;
            program.programBudgetNextYear[idx].assigned = '';
            val.remaining = program.programBudgetNextYear[idx].remaining;
            program.programBudgetNextYear[idx].remaining = '';
            val.remainingPercent = program.programBudgetNextYear[idx].remainingPercent;
            program.programBudgetNextYear[idx].remainingPercent = '';
          }
        });
        program.programBudgetNextYear = undefined;
      }
    });

    res.ok({
      message: 'Budget Switch Completed.'
    });
  },

  projectsByPortfolio: async (req, res) => {
    let projects = await Reports.find({
      portfolio: req.body.portfolioId
    }).populateAll();

    projects = projects.filter(project => {
      if (project.subPortfolio != undefined) {
        return project.subPortfolio == req.body.subPortfolio;
      }
    });

    res.ok(projects);
  },

  uploadExcelDumpToDrive: async (req, res) => {
    const XLSX = require('xlsx');
    const moment = require('moment');
    const FrontEndPATH = "http://euk-88794.eukservers.com/#";

    let dropdownsList = await Dropdown.find().populateAll();
    let questions = await Questions.find().populateAll();

    let outlineQuestions = questions.find(val => val.name == 'Project Outline').questions;
    let orderQuestions = questions.find(val => val.name == 'Project Order').questions;
    let changeReqQuestions = questions.find(val => val.name == 'Change Request').questions;
    let closingQuestions = questions.find(val => val.name == 'Closing Report').questions;

    let dropdowns = {};
    dropdownsList.forEach(element => {
      dropdowns[`${toCamelCase(element.field)}Values`] = element;
    });

    let milestonesList = [];
    let risksList = [];
    let decisionsList = [];
    let measuresList = [];
    let evaList = [];
    let projectBudgetCurrentYearList = [];
    let projectBudgetNextYearList = [];
    let projectActualBudgetList = [];
    let lessonsLearned = [];
    let multiProjectReport = [];
    let projectStatusReports = [];
    let milestoneTrendAnalysis = [];
    let currentReservesTrendAnalysis = [];
    let projectQuestions = [];
    let dependenciesList = [];
    let portfolioBudgetCurrentYearList = [];
    let portfolioBudgetNextYearList = [];
    let subPortfolioBudgetCurrentYearList = [];
    let subPortfolioBudgetNextYearList = [];
    let programBudgetCurrentYearList = [];
    let programBudgetNextYearList = [];
    let programDetails = [];
    let programAggregatedCost = [];
    let pipelineProjectsList = [];
    let documentsList = [];

    let reports = await Reports.find().populateAll();
    let portfolios = await Portfolio.find().populateAll();
    let programs = await Program.find().populateAll();
    let pipelineProjects = await Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }
      ]
    }).populateAll().sort('createdAt DESC');
    let approvals = await OutlineApproval.find({
      assignedTo: req.params.id
    }).populateAll().sort('createdAt DESC');
    approvals = approvals.filter(val => val.sentTo == 'PMO');

    // Reports
    reports.forEach(reportObj => {
      let milestones = reportObj.mileStonesValues;
      if (Array.isArray(milestones)) {
        milestones.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.dueDate = moment(val.dueDate).format('dd.MMMM.yyyy')
        });
        milestonesList.push(...milestones);
      }

      let risks = reportObj.risks;
      if (risks != undefined) {
        risks.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
        });
        risksList.push(...risks);
      }

      let decisions = reportObj.decisions;
      if (decisions != undefined) {
        decisions.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.date = moment(val.date).format('dd.MMMM.yyyy');
        });
        decisionsList.push(...decisions);
      }

      let measures = reportObj.measures;
      if (measures != undefined) {
        measures.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
        });
        measuresList.push(...measures);
      }

      let eva = reportObj.EVA;
      if (eva != undefined) {
        eva.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
        });
        evaList.push(...eva);
      }

      let projectBudgetCurrentYear = reportObj.budgetPlanningTable1;
      if (projectBudgetCurrentYear != undefined) {
        projectBudgetCurrentYear.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.projectName = reportObj.projectName;
          if (reportObj.psp) {
            val.psp1 = reportObj.psp[0].psp;
            val.psp2 = reportObj.psp[1].psp;
            val.psp3 = reportObj.psp[2].psp;
          }
          val.businessArea = reportObj.businessArea ? reportObj.businessArea.name : '';
          val.businessUnit = reportObj.businessUnit ? reportObj.businessUnit.name : '';
          val.businessSegment = reportObj.businessSegment ? reportObj.businessSegment.name : '';
          val.portfolioName = reportObj.portfolio ? reportObj.portfolio.name : '';
          val.subPortfolio = reportObj.subPortfolio;
        });
        projectBudgetCurrentYearList.push(...projectBudgetCurrentYear);
      }

      let projectBudgetNextYear = reportObj.budgetPlanningTable2;
      if (projectBudgetNextYear != undefined) {
        projectBudgetNextYear.forEach((val, idx) => {
          delete (val.actualCost);
          delete (val.forecast);
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.projectName = reportObj.projectName;
          val.status = reportObj.status;
          if (reportObj.psp) {
            val.psp1 = reportObj.psp[0].psp;
            val.psp2 = reportObj.psp[1].psp;
            val.psp3 = reportObj.psp[2].psp;
          }
          val.businessArea = reportObj.businessArea ? reportObj.businessArea.name : '';
          val.businessUnit = reportObj.businessUnit ? reportObj.businessUnit.name : '';
          val.businessSegment = reportObj.businessSegment ? reportObj.businessSegment.name : '';
          val.portfolioName = reportObj.portfolio ? reportObj.portfolio.name : '';
          val.subPortfolio = reportObj.subPortfolio;
        });
        projectBudgetNextYearList.push(...projectBudgetNextYear);
      }

      let projectActualBudget = reportObj.actualCostTable;
      if (projectActualBudget != undefined) {
        projectActualBudget.forEach((val, idx) => {
          delete (val.actualBudget);
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.projectName = reportObj.projectName;
        });
        projectActualBudgetList.push(...projectActualBudget);
      }

      let lessonsLearnedArr = reportObj.lessonsLearned;
      if (lessonsLearnedArr != undefined) {
        lessonsLearnedArr.forEach((val, idx) => {
          lessonsLearned.push({
            description: val.description,
            type: val.lessonType,
            category: val.lessonCategory.name,
            projectId: reportObj.uid,
            projectName: reportObj.projectName,
            projectType: reportObj.projectType.name
          });
        });
      }

      let technology = [];
      if (reportObj.technology) {
        dropdowns.technologyOptions.values.map(techObj => {
          let obj = reportObj.technology.find(val => {
            if (val == techObj.id) {
              technology.push(techObj.name);
            }
          });
        });
      }

      multiProjectReport.push({
        id: reportObj.uid,
        projectName: reportObj.projectName,
        projectManager: reportObj.projectManager.name,
        projectSponsor: reportObj.projectSponsor.name,
        projectPhase: reportObj.projectPhase ? reportObj.projectPhase.name : '',
        businessSegment: reportObj.businessSegment ? reportObj.businessSegment.name : '',
        reportingLevel: reportObj.reportingLevel ? reportObj.reportingLevel.name : '',
        businessUnit: reportObj.businessUnit ? reportObj.businessUnit.name : '',
        businessArea: reportObj.businessArea ? reportObj.businessArea.name : '',
        portfolioId: reportObj.portfolio ? reportObj.portfolio.id : '',
        portfolioName: reportObj.portfolio ? reportObj.portfolio.name : '',
        strategicContribution: reportObj.strategicContribution ? reportObj.strategicContribution.name : '',
        subPortfolio: reportObj.subPortfolio,
        profitability: reportObj.profitability ? reportObj.profitability.name : '',
        overallStatus: reportObj.statusReports.length > 0 ? statusConverter(reportObj.statusReports[reportObj.statusReports.length - 1].overallStatus) : '',
        scopeStatus: reportObj.statusReports.length > 0 ? statusConverter(reportObj.statusReports[reportObj.statusReports.length - 1].scopeStatus) : '',
        costStatus: reportObj.statusReports.length > 0 ? statusConverter(reportObj.statusReports[reportObj.statusReports.length - 1].costStatus) : '',
        timeStatus: reportObj.statusReports.length > 0 ? statusConverter(reportObj.statusReports[reportObj.statusReports.length - 1].timeStatus) : '',
        riskStatus: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].riskStatus : '',
        psp: reportObj.psp ? reportObj.psp[0].psp : '',
        currency: reportObj.currency,
        status: reportObj.status,
        bkwShare: reportObj.bkwShare,
        IRR: reportObj.kpisTable[4].value,
        GwH: reportObj.GwH,
        confidential: reportObj.confidential,
        digitalizationDegree: reportObj.digitalizationDegree != undefined ? reportObj.digitalizationDegree.name : '',
        digitalizationFocus: reportObj.digitalizationFocus != undefined ? reportObj.digitalizationFocus.name : '',
        digitalizationTopic: reportObj.digitalizationTopic != undefined ? reportObj.digitalizationTopic.name : '',
        technology: technology.join(', '),
        purpose: reportObj.purpose,
        SPI: reportObj.EVA ? reportObj.EVA.length > 0 ? reportObj.EVA[reportObj.EVA.length - 1].SPI : '' : '',
        riskExposureVsCurrentBudget: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].riskExposureVsCurrentBudget : '',
        totalExposure: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].totalExposure : '',
        plannedEndDateVsForecastEndDate: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].plannedDateVSForecastDate : '',
        currentBudgetVSForecast: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].currentBudgetVSForecast : '',
        currentBudgetVSOriginalBudget: reportObj.currentBudgetVSOriginalBudget,
        endDateVSPlannedEndDate: reportObj.endDateVSPlannedEndDate,
        EAC: reportObj.EVA ? reportObj.EVA.length > 0 ? reportObj.EVA[reportObj.EVA.length - 1].EAC : '' : '',
        CPI: reportObj.EVA ? reportObj.EVA.length > 0 ? reportObj.EVA[reportObj.EVA.length - 1].CPI : '' : '',
        percentageComplete: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].percentageComplete : '',
        managementSummary: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].managementSummary : '',
        scopeStatusComments: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].scopeStatusComments : '',
        costStatusComments: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].costStatusComments : '',
        timeStatusComments: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].timeStatusComments : '',
        projectMethodology: reportObj.projectMethodology ? reportObj.projectMethodology.name : '',
        forecastEndDate: moment(reportObj.forecastEndDate).format('dd.MMMM.yyyy'),
        plannedEndDate: moment(reportObj.plannedEndDate).format('dd.MMMM.yyyy'),
        startDate: moment(reportObj.startDate).format('dd.MMMM.yyyy'),
        endDate: moment(reportObj.endDate).format('dd.MMMM.yyyy'),
        forecast: reportObj.costTypeTable[6].forecast,
        currentBudget: reportObj.costTypeTable[6].currentBudget,
        originalBudget: reportObj.costTypeTable[6].originalBudget,
        actualCost: reportObj.costTypeTable[6].actualCost,
        programName: reportObj.program ? reportObj.program.programName : '',
        reportingDate: reportObj.statusReports.length > 0 ? moment(reportObj.statusReports[reportObj.statusReports.length - 1].reportingDate).format('dd.MMMM.yyyy') : '',
      });

      if (reportObj.statusReports != undefined) {
        if (reportObj.statusReports.length > 0) {
          reportObj.statusReports.forEach(statusReportObj => {
            projectStatusReports.push({
              projectId: reportObj.project.uid,
              projectName: reportObj.projectName,
              reportingDate: moment(statusReportObj.reportingDate).format('dd.MMMM.yyyy'),
              submittedDate: statusReportObj.submittedDate != undefined ? moment(statusReportObj.submittedDate).format('dd.MMMM.yyyy') : '',
              actualCost: statusReportObj.costTypeTable[6].actualCost,
              forecast: statusReportObj.costTypeTable[6].forecast,
              originalBudget: statusReportObj.costTypeTable[6].originalBudget,
              currentBudget: statusReportObj.costTypeTable[6].currentBudget,
            });
          });
        }
      }

      if (reportObj.milestoneTable) {
        reportObj.milestoneTable.map(obj => {
          obj.reportingDate = moment(obj.reportingDate).format('dd.MMMM.yyyy');
          if (Object.keys(obj).length > 1) {
            for (let i = 1; i < Object.keys(obj).length; i++) {
              obj[`milestone${i}`] = moment(obj[`milestone${i}`]).format('dd.MMMM.yyyy');
            }
          }

          milestoneTrendAnalysis.push({
            ...obj,
            projectId: reportObj.uid,
            projectName: reportObj.projectName
          });
        });
      }

      reportObj.currentReserveHistory.map(obj => {
        currentReservesTrendAnalysis.push({
          reportingDate: moment(obj.date).format('dd.MMMM.yyyy'),
          currentReserve: obj.value,
          projectId: reportObj.uid,
          projectName: reportObj.projectName
        });
      });

      let outlineQues = [];
      reportObj.question.forEach((val, idx) => {
        outlineQues.push({
          question: outlineQuestions[0].question,
          answer: val,
          projectId: reportObj.uid,
          projectName: reportObj.projectName
        });
      });
      let orderQues = [];
      if (reportObj.orderQuestion) {
        reportObj.orderQuestion.forEach((val, idx) => {
          orderQues.push({
            question: orderQuestions[0].question,
            answer: val,
            projectId: reportObj.uid,
            projectName: reportObj.projectName
          });
        });
      }
      let changeQues = [];
      if (reportObj.changeRequestQuestion) {
        reportObj.changeRequestQuestion.forEach((val, idx) => {
          changeQues.push({
            question: changeReqQuestions[0].question,
            answer: val,
            projectId: reportObj.uid,
            projectName: reportObj.projectName
          });
        });
      }
      let closingQuestions = [];
      if (reportObj.closingQuestion) {
        reportObj.closingQuestion.forEach((val, idx) => {
          closingQuestions.push({
            question: outlineQuestions[0].question,
            answer: val,
            projectId: reportObj.uid,
            projectName: reportObj.projectName
          });
        });
      }
      projectQuestions.push(...outlineQues, ...orderQues, ...changeQues, ...closingQuestions);

      let dependencies = [];
      if (reportObj.impactedByDependenciesTable) {
        reportObj.impactedByDependenciesTable.forEach(val => {
          let dependeeProject = dropdowns.projectList.find(obj => obj.id == val.project);
          dependencies.push({
            projectId: reportObj.uid,
            projectName: reportObj.projectName,
            description: val.description,
            impact: val.impact != undefined ? val.impact.name : '',
            project: dependeeProject ? dependeeProject.projectName : ''
          });
        });
        dependenciesList.push(...dependencies)
      }
    });

    // Portfolio
    portfolios.forEach(portfolio => {
      let portfolioBudgetCurrentYear = portfolio.portfolioBudgetingList != undefined ? portfolio.portfolioBudgetingList.portfolioBudgetCurrentYear : [];
      if (portfolioBudgetCurrentYear != undefined) {
        portfolioBudgetCurrentYear.forEach((val, idx) => {
          val.portfolioId = portfolio.id;
          val.portfolioName = portfolio.name;
        });
        portfolioBudgetCurrentYearList.push(...portfolioBudgetCurrentYear);
      }

      let portfolioBudgetNextYear = portfolio.portfolioBudgetingList != undefined ? portfolio.portfolioBudgetingList.portfolioBudgetNextYear : [];
      if (portfolioBudgetNextYear != undefined) {
        portfolioBudgetNextYear.forEach((val, idx) => {
          delete (val.actualCost);
          delete (val.forecast);
          val.portfolioId = portfolio.id;
          val.portfolioName = portfolio.name;
        });
        portfolioBudgetNextYearList.push(...portfolioBudgetNextYear);
      }

      // Current Year
      if (portfolio.subPortfolioBudgetingList != undefined) {
        portfolio.subPortfolioBudgetingList.forEach(subPortBudgetObj => {
          let subPortfolioBudgetCurrentYear = subPortBudgetObj.subPortfolioBudgetCurrentYear;
          if (subPortfolioBudgetCurrentYear != undefined) {
            subPortfolioBudgetCurrentYear.forEach((val, idx) => {
              val.portfolioId = portfolio.id;
              val.portfolioName = portfolio.name;
              val.subPortfolio = subPortBudgetObj.subPortfolio;
              val.pspCurrentYear = subPortBudgetObj.pspCurrentYear;
            });
            subPortfolioBudgetCurrentYearList.push(...subPortfolioBudgetCurrentYear);
          }
        });

        // Next Year
        portfolio.subPortfolioBudgetingList.forEach(subPortBudgetObj => {
          let subPortfolioBudgetNextYear = subPortBudgetObj.subPortfolioBudgetNextYear;
          if (subPortfolioBudgetNextYear != undefined) {
            subPortfolioBudgetNextYear.forEach((val, idx) => {
              delete (val.actualCost);
              delete (val.forecast);
              val.portfolioId = portfolio.id;
              val.portfolioName = portfolio.name;
              val.subPortfolio = subPortBudgetObj.subPortfolio;
              val.pspNextYear = subPortBudgetObj.pspNextYear;
            });
            subPortfolioBudgetNextYearList.push(...subPortfolioBudgetNextYear);
          }
        });
      }
    });

    // Programs
    programs.forEach(program => {
      let programBudgetCurrentYear = program.programBudgetCurrentYear;
      if (programBudgetCurrentYear != undefined) {
        programBudgetCurrentYear.forEach((val, idx) => {
          val.programId = program.uid;
          val.programName = program.programName;
        });
        programBudgetCurrentYearList.push(...programBudgetCurrentYear);
      }

      let programBudgetNextYear = program.programBudgetNextYear;
      if (programBudgetNextYear != undefined) {
        programBudgetNextYear.forEach((val, idx) => {
          delete (val.actualCost);
          delete (val.forecast);
          val.programId = program.uid;
          val.programName = program.programName;
        });
        programBudgetNextYearList.push(...programBudgetNextYear);
      }

      programDetails.push({
        programName: program.programName,
        purpose: program.purpose,
        startDate: moment(program.startDate).format('dd.MMMM.yyyy'),
        endDate: moment(program.startDate).format('dd.MMMM.yyyy'),
        overallStatus: program.statusReports ? program.statusReports.length > 0 ? statusConverter(program.statusReports[program.statusReports.length - 1].overallStatus) : '' : '',
        overallStatusComments: program.statusReports ? program.statusReports.length > 0 ? program.statusReports[program.statusReports.length - 1].overallStatusComments : '' : '',
        scopeStatus: program.statusReports ? program.statusReports.length > 0 ? statusConverter(program.statusReports[program.statusReports.length - 1].scopeStatus) : '' : '',
        scopeStatusComments: program.statusReports ? program.statusReports.length > 0 ? program.statusReports[program.statusReports.length - 1].scopeStatusComments : '' : '',
        costStatus: program.statusReports ? program.statusReports.length > 0 ? statusConverter(program.statusReports[program.statusReports.length - 1].costStatus) : '' : '',
        costStatusComments: program.statusReports ? program.statusReports.length > 0 ? program.statusReports[program.statusReports.length - 1].costStatusComments : '' : '',
        timeStatus: program.statusReports ? program.statusReports.length > 0 ? statusConverter(program.statusReports[program.statusReports.length - 1].timeStatus) : '' : '',
        timeStatusComments: program.statusReports ? program.statusReports.length > 0 ? program.statusReports[program.statusReports.length - 1].timeStatusComments : '' : '',
      });

      let aggregatedProgramTable1 = program.aggregatedProgramTable1;
      if (program.aggregatedProgramTable1) {
        aggregatedProgramTable1.forEach(obj => {
          obj.programName = program.programName;
        });
        programAggregatedCost.push(...aggregatedProgramTable1)
      }
    });

    pipelineProjects.forEach(pipelineProject => {
      let totalBudget;
      let budget;
      let businessUnit;
      let businessArea;
      if (pipelineProject.docType == 'Outline') {
        budget = pipelineProject.projectOutline[0].estimatedProjectTable[6].budget;
        totalBudget = pipelineProject.projectOutline[0].fundsApprovedForInitiationTable[6].budget;
        businessArea = dropdowns.businessAreaValues.values.find(val => val.id == pipelineProject.projectOutline[0].businessArea).name
        businessUnit = dropdowns.businessUnitValues.values.find(val => val.id == pipelineProject.projectOutline[0].businessUnit).name;
      } else {
        totalBudget = pipelineProject.projectOrder[0].costTypeTable[6].budget;
        businessArea = dropdowns.businessAreaValues.values.find(val => val.id == pipelineProject.projectOrder[0].businessArea).name;
        businessUnit = dropdowns.businessUnitValues.values.find(val => val.id == pipelineProject.projectOrder[0].businessUnit).name;
      }

      pipelineProjectsList.push({
        projectId: pipelineProject.uid,
        projectName: pipelineProject.projectName,
        purpose: pipelineProject.projectReport ? pipelineProject.projectReport.purpose : '',
        projectManager: pipelineProject.projectOutline[0].projectManager.name,
        projectSponsor: pipelineProject.projectOutline[0].projectSponsor.name,
        businessUnit,
        businessArea,
        totalBudget,
        budget
      });
    });

    approvals.map(val => {
      let link;
      let businessArea;
      let businessUnit;
      let projectManager;

      if (val.docType == 'Outline') {
        if (val.projectOutline.businessArea.name == undefined) {
          businessArea = dropdowns.businessAreaOptions.values.find(value => value.id == val.projectOutline.businessArea)
          businessUnit = dropdowns.businessUnitOptions.values.find(value => value.id == val.projectOutline.businessUnit)
        } else {
          businessArea = val.projectOutline.businessArea;
          businessUnit = val.projectOutline.businessUnit;
        }
        projectManager = val.projectOutline.projectManager.name;
        link = `${FrontEndPATH}/view/outline/${val.id}`;
      } else if (val.docType == 'Order') {
        if (val.projectOrder.businessArea.name == undefined) {
          businessArea = dropdowns.businessAreaOptions.values.find(value => value.id == val.projectOrder.businessArea);
          businessUnit = dropdowns.businessUnitOptions.values.find(value => value.id == val.projectOrder.businessUnit);
        } else {
          businessArea = val.projectOrder.businessArea;
          businessUnit = val.projectOrder.businessUnit;
        }
        projectManager = val.projectOrder.projectManager.name;
        link = `${FrontEndPATH}/view/order/${val.id}`;
      } else if (val.docType == 'Change Request') {
        if (val.changeRequest.businessArea.name == undefined) {
          businessArea = dropdowns.businessAreaOptions.values.find(value => value.id == val.changeRequest.businessArea)
          businessUnit = dropdowns.businessUnitOptions.values.find(value => value.id == val.changeRequest.businessUnit)
        } else {
          businessArea = val.changeRequest.businessArea;
          businessUnit = val.changeRequest.businessUnit;
        }
        projectManager = val.changeRequest.projectManager.name;
        link = `${FrontEndPATH}/view/changeRequest/${val.id}`;
      } else if (val.docType == 'Closing Report') {
        projectManager = val.closingReport.projectManager.name;
        link = `${FrontEndPATH}/view/closingReport/${val.id}`;
      }

      documentsList.push({
        uid: val.uid,
        projectName: val.project.projectName,
        docType: val.docType,
        status: val.status,
        version: val.version,
        businessArea: businessArea ? businessArea.name : '',
        businessUnit: businessUnit ? businessUnit.name : '',
        projectManager,
        link
      });
    });

    const workbook = XLSX.utils.book_new();

    const milestonesheet = XLSX.utils.json_to_sheet(milestonesList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, milestonesheet, 'Milestones');

    const riskSheet = XLSX.utils.json_to_sheet(risksList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, riskSheet, 'Risks');

    const decisionsSheet = XLSX.utils.json_to_sheet(decisionsList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, decisionsSheet, 'Decisions');

    const measuresSheet = XLSX.utils.json_to_sheet(measuresList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, measuresSheet, 'Measures');

    const evaSheet = XLSX.utils.json_to_sheet(evaList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, evaSheet, 'EVA');

    const projectBudgetCurrentYearSheet = XLSX.utils.json_to_sheet(projectBudgetCurrentYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, projectBudgetCurrentYearSheet, 'Project Budget Current Year');

    const projectBudgetNextYearSheet = XLSX.utils.json_to_sheet(projectBudgetNextYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, projectBudgetNextYearSheet, 'Project Budget Next Year');

    const projectActualBudgetSheet = XLSX.utils.json_to_sheet(projectActualBudgetList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, projectActualBudgetSheet, 'Project Actual Budget');

    const lessonsLearnedSheet = XLSX.utils.json_to_sheet(lessonsLearned, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, lessonsLearnedSheet, 'Lessons Learned');

    const portfolioBudgetCurrentYearSheet = XLSX.utils.json_to_sheet(portfolioBudgetCurrentYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, portfolioBudgetCurrentYearSheet, 'Portfolio Budget Current Year');

    const portfolioBudgetNextYearSheet = XLSX.utils.json_to_sheet(portfolioBudgetNextYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, portfolioBudgetNextYearSheet, 'Portfolio Budget Next Year');

    const subPortfolioBudgetCurrentYearSheet = XLSX.utils.json_to_sheet(subPortfolioBudgetCurrentYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, subPortfolioBudgetCurrentYearSheet, 'Sub-Port Budget Current Year');

    const subPortfolioBudgetNextYearSheet = XLSX.utils.json_to_sheet(subPortfolioBudgetNextYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, subPortfolioBudgetNextYearSheet, 'Sub-Port Budget Next Year');

    const programBudgetCurrentYearSheet = XLSX.utils.json_to_sheet(programBudgetCurrentYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, programBudgetCurrentYearSheet, 'Program Budget Current Year');

    const programBudgetNextYearSheet = XLSX.utils.json_to_sheet(programBudgetNextYearList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, programBudgetNextYearSheet, 'Program Budget Next Year');

    const multiProjectReportSheet = XLSX.utils.json_to_sheet(multiProjectReport, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, multiProjectReportSheet, 'Multi Project Report');

    const programDetailsSheet = XLSX.utils.json_to_sheet(programDetails, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, programDetailsSheet, 'Program Details');

    const programAggregatedCostSheet = XLSX.utils.json_to_sheet(programAggregatedCost, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, programAggregatedCostSheet, 'Program Aggregated Cost');

    const projectStatusReportSheet = XLSX.utils.json_to_sheet(projectStatusReports, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, projectStatusReportSheet, 'Status History');

    const currentReservesTrendAnalysisSheet = XLSX.utils.json_to_sheet(currentReservesTrendAnalysis, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, currentReservesTrendAnalysisSheet, 'Current Reserves');

    const milestoneTrendAnalysisSheet = XLSX.utils.json_to_sheet(milestoneTrendAnalysis, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, milestoneTrendAnalysisSheet, 'Milestone Trend Analysis');

    const projectQuestionsSheet = XLSX.utils.json_to_sheet(projectQuestions, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, projectQuestionsSheet, 'Project Questions');

    const pipelineProjectsSheet = XLSX.utils.json_to_sheet(pipelineProjectsList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, pipelineProjectsSheet, 'Pipeline Projects');

    const dependenciesSheet = XLSX.utils.json_to_sheet(dependenciesList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, dependenciesSheet, 'Dependencies');

    const documentsSheet = XLSX.utils.json_to_sheet(documentsList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, documentsSheet, 'Documents');

    const filename = `Excel-Dump-${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, filename);

    res.ok({
      message: 'ok'
    });
  },

};

toCamelCase = (str) => {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

statusConverter = (status) => {
  if (status == 'Green') {
    return 1;
  } else if (status == 'Red') {
    return 3;
  } else if (status == "Yellow") {
    return 2;
  }
}
