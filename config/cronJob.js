const userController = require('../api/controllers/UserController');
// const reportsController = require('../api/controllers/ReportsController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  // Email Reminder For Project Order Creation
  userController.emailReminderOrderCreation();

  // sent email reminder for project closing report creation
  userController.emailReminderClosingReport();

  //send email reminder for those approval which are pending
  userController.emailReminderPendingApprovals();

  //Email Reminder for Status Report Creation
  userController.emailReminderStatusReport();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderOrderCreation();

    userController.emailReminderClosingReport();

    userController.emailReminderPendingApprovals();

    userController.emailReminderStatusReport();
  }, intervalTimer);

  // Excel Export
  uploadExcelDumpToDrive();

  setInterval(() => {
    uploadExcelDumpToDrive();
  }, 1000 * 60 * 45);
};

async function uploadExcelDumpToDrive(req, res) {
  try {
    const XLSX = require('xlsx');
    const moment = require('moment');
    const fs = require('fs');
    const XlsxPopulate = require('xlsx-populate');
    const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
    const FrontEndPATH = config.callbackRedirectUrl.split('#')[0];
    let generalList = [{
      date: moment().format('DD.MMM.YYYY'),
      time: moment().format('h:mm:ss a')
    }];

    let dropdownsList = await Dropdown.find().populateAll();
    let questions = await Questions.find().populateAll();

    let outlineQuestions = questions.find(val => val.name == 'Project Outline').questions;
    let orderQuestions = questions.find(val => val.name == 'Project Order').questions;
    let changeReqQuestions = questions.find(val => val.name == 'Change Request').questions;
    let closingRepQuestions = questions.find(val => val.name == 'Closing Report').questions;

    let dropdowns = {};
    dropdownsList.forEach(element => {
      dropdowns[`${toCamelCase(element.field)}Values`] = element;
    });

    let milestonesList = [];
    let risksList = [];
    let decisionsList = [];
    let measuresList = [];
    let evaList = [];
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
    let subportfolioBudgetList = [];
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
    let approvals = await OutlineApproval.find().populateAll();
    approvals = approvals.filter(val => val.sentTo == 'PMO');
    let subportfolioBudgetCollection = await PortfolioBudgetYear.find().populateAll();

    // Reports
    reports.forEach(async reportObj => {
      let milestones = reportObj.mileStonesValues;
      if (Array.isArray(milestones)) {
        milestones.forEach((val, idx) => {
          val.reportId = reportObj.id;
          val.projectId = reportObj.uid;
          val.dueDate = moment(val.dueDate).format('DD.MMM.YYYY')
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
          val.date = moment(val.date).format('DD.MMM.YYYY');
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

      let projectActualBudget = reportObj.actualCostTable;
      if (projectActualBudget != undefined) {
        projectActualBudget.forEach((val, idx) => {
          delete(val.actualBudget);
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
            projectType: reportObj.projectType ? reportObj.projectType.name : ''
          });
        });
      }

      let technology = [];
      if (reportObj.technology) {
        if (dropdowns.technologyOptions) {
          dropdowns.technologyOptions.values.map(techObj => {
            let obj = reportObj.technology.find(val => {
              if (val == techObj.id) {
                technology.push(techObj.name);
              }
            });
          });
        }
      }

      let itPlatformsName = '';
      if (reportObj.itPlatform) {
        if (reportObj.itPlatform.length > 0) {
          let itPlatforms = await DropdownMapper.find({
            id: {
              $in: reportObj.itPlatform
            }
          });
          if (itPlatforms) {
            if (itPlatforms.length > 0) {
              itPlatforms.forEach((itPlatform, idx) => {
                if (idx == 0) {
                  itPlatformsName = itPlatform.name;
                } else {
                  itPlatformsName = itPlatformsName + ', ' + itPlatform.name;
                }
              });
            }
          }
        }
      }

      multiProjectReport.push({
        id: reportObj.uid,
        projectName: reportObj.projectName,
        projectManager: reportObj.projectManager.name,
        projectSponsor: reportObj.projectSponsor.name,
        portfolio: reportObj.portfolio ? reportObj.portfolio.name : '',
        subPortfolio: reportObj.subPortfolio,
        projectPhase: reportObj.projectPhase ? reportObj.projectPhase.name : '',
        businessSegment: reportObj.businessSegment ? reportObj.businessSegment.name : '',
        reportingLevel: reportObj.reportingLevel ? reportObj.reportingLevel.name : '',
        businessUnit: reportObj.businessUnit ? reportObj.businessUnit.name : '',
        businessArea: reportObj.businessArea ? reportObj.businessArea.name : '',
        portfolioId: reportObj.portfolio ? reportObj.portfolio.id : '',
        portfolioName: reportObj.portfolio ? reportObj.portfolio.name : '',
        strategicContribution: reportObj.strategicContribution ? reportObj.strategicContribution.name : '',
        profitability: reportObj.profitability ? reportObj.profitability.name : '',
        itRelevant: reportObj.itRelevant ? reportObj.itRelevant.name : '',
        itPlatform: itPlatformsName,
        /*reportObj.itPlatform != undefined ? reportObj.itPlatform.name : '',*/
        projectMethodology: reportObj.projectMethodology ? reportObj.projectMethodology.name : '',
        confidential: reportObj.confidential,
        reportStatus: reportObj.statusReports.length > 0 ? reportObj.statusReports[reportObj.statusReports.length - 1].status : '',
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
        forecastEndDate: moment(reportObj.forecastEndDate).format('DD.MMM.YYYY'),
        plannedEndDate: moment(reportObj.plannedEndDate).format('DD.MMM.YYYY'),
        startDate: moment(reportObj.startDate).format('DD.MMM.YYYY'),
        endDate: moment(reportObj.endDate).format('DD.MMM.YYYY'),
        forecast: reportObj.costTypeTable[6].forecast,
        currentBudget: reportObj.costTypeTable[6].currentBudget,
        originalBudget: reportObj.costTypeTable[6].originalBudget,
        actualCost: reportObj.costTypeTable[6].actualCost,
        programName: reportObj.program ? reportObj.program.programName : '',
        reportingDate: reportObj.statusReports.length > 0 ? moment(reportObj.statusReports[reportObj.statusReports.length - 1].reportingDate).format('DD.MMM.YYYY') : '',
      });

      if (reportObj.statusReports != undefined) {
        if (reportObj.statusReports.length > 0) {
          reportObj.statusReports.forEach(statusReportObj => {
            projectStatusReports.push({
              projectId: reportObj.uid,
              projectName: reportObj.projectName,
              reportingDate: moment(statusReportObj.reportingDate).format('DD.MMM.YYYY'),
              submittedDate: statusReportObj.submittedDate != undefined ? moment(statusReportObj.submittedDate).format('DD.MMM.YYYY') : '',
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
          obj.reportingDate = moment(obj.reportingDate).format('DD.MMM.YYYY');
          if (Object.keys(obj).length > 1) {
            for (let i = 1; i < Object.keys(obj).length; i++) {
              obj[`milestone${i}`] = moment(obj[`milestone${i}`]).format('DD.MMM.YYYY');
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
          reportingDate: moment(obj.date).format('DD.MMM.YYYY'),
          currentReserve: obj.value,
          projectId: reportObj.uid,
          projectName: reportObj.projectName
        });
      });

      let outlineQues = [];
      reportObj.question.forEach((val, idx) => {
        outlineQues.push({
          question: outlineQuestions[idx].question,
          answer: val,
          projectId: reportObj.uid,
          projectName: reportObj.projectName
        });
      });
      let orderQues = [];
      if (reportObj.orderQuestion) {
        reportObj.orderQuestion.forEach((val, idx) => {
          orderQues.push({
            question: orderQuestions[idx].question,
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
            question: changeReqQuestions[idx].question,
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
            question: closingRepQuestions[idx].question,
            answer: val,
            projectId: reportObj.uid,
            projectName: reportObj.projectName
          });
        });
      }
      projectQuestions.push(...outlineQues, ...orderQues, ...changeQues, ...closingQuestions);

      let dependencies = [];
      if (reportObj.impactedByDependenciesTable) {
        reportObj.impactedByDependenciesTable.forEach(async val => {
          // let dependeeProject = dropdowns.projectList.find(obj => obj.id == val.project);
          let dependeeProject = await Projects.find({
            id: val.project
          });
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
          delete(val.actualCost);
          delete(val.forecast);
          val.portfolioId = portfolio.id;
          val.portfolioName = portfolio.name;
        });
        portfolioBudgetNextYearList.push(...portfolioBudgetNextYear);
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
          delete(val.actualCost);
          delete(val.forecast);
          val.programId = program.uid;
          val.programName = program.programName;
        });
        programBudgetNextYearList.push(...programBudgetNextYear);
      }

      programDetails.push({
        programName: program.programName,
        purpose: program.purpose,
        startDate: moment(program.startDate).format('DD.MMM.YYYY'),
        endDate: moment(program.startDate).format('DD.MMM.YYYY'),
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
        businessArea = dropdowns.businessAreaValues.values.find(val => val.id == pipelineProject.projectOutline[0].businessArea).name || ''
        businessUnit = dropdowns.businessUnitValues.values.find(val => val.id == pipelineProject.projectOutline[0].businessUnit).name || '';
      } else {
        totalBudget = pipelineProject.projectOrder[0].costTypeTable[6].budget;
        businessArea = dropdowns.businessAreaValues.values.find(val => val.id == pipelineProject.projectOrder[0].businessArea).name || '';
        businessUnit = dropdowns.businessUnitValues.values.find(val => val.id == pipelineProject.projectOrder[0].businessUnit).name || '';
        fico = pipelineProject.projectOrder[0].projectFico.name;
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
          businessArea = dropdowns.businessAreaValues.values.find(value => value.id == val.projectOutline.businessArea)
          businessUnit = dropdowns.businessUnitValues.values.find(value => value.id == val.projectOutline.businessUnit)
        } else {
          businessArea = val.projectOutline.businessArea;
          businessUnit = val.projectOutline.businessUnit;
        }
        projectManager = val.projectOutline.projectManager.name;
        link = `${FrontEndPATH}/view/outline/${val.id}`;
      } else if (val.docType == 'Order') {
        if (val.projectOrder.businessArea.name == undefined) {
          businessArea = dropdowns.businessAreaValues.values.find(value => value.id == val.projectOrder.businessArea);
          businessUnit = dropdowns.businessUnitValues.values.find(value => value.id == val.projectOrder.businessUnit);
        } else {
          businessArea = val.projectOrder.businessArea;
          businessUnit = val.projectOrder.businessUnit;
        }
        projectManager = val.projectOrder.projectManager.name;
        link = `${FrontEndPATH}/view/order/${val.id}`;
      } else if (val.docType == 'Change Request') {
        if (val.changeRequest.businessArea == undefined) {
          businessArea = dropdowns.businessAreaValues.values.find(value => value.id == val.changeRequest.businessArea)
          businessUnit = dropdowns.businessUnitValues.values.find(value => value.id == val.changeRequest.businessUnit)
        } else {
          businessArea = val.changeRequest.businessArea;
          businessUnit = val.changeRequest.businessUnit;
        }
        projectManager = val.changeRequest.projectManager ? val.changeRequest.projectManager.name : '';
        link = `${FrontEndPATH}/view/changeRequest/${val.id}`;
      } else if (val.docType == 'Closing Report') {
        projectManager = val.closingReport.projectManager ? val.closingReport.projectManager.name : '';
        link = `${FrontEndPATH}/view/closingReport/${val.id}`;
      }

      documentsList.push({
        uid: val.uid,
        projectName: val.project ? val.project.projectName : '',
        docType: val.docType,
        status: val.overallStatus,
        version: val.version,
        businessArea: businessArea ? businessArea.name : '',
        businessUnit: businessUnit ? businessUnit.name : '',
        projectManager,
        link
      });
    });

    // Yearly Budget
    let projectBudgetGroupedByYears = _.groupBy(subportfolioBudgetCollection, 'year');
    let yearsKeys = Object.keys(projectBudgetGroupedByYears);
    let currentYear = moment().year();
    let yearIndex = yearsKeys.indexOf(currentYear.toString());

    if (yearIndex > 0) {
      let indexes = [yearIndex - 1, yearIndex, yearIndex + 1];
      let temp = [];
      indexes.map(val => {
        if (val > -1) {
          if (yearsKeys[val] != undefined) {
            temp.push(yearsKeys[val])
          }
        }
      });
      yearsKeys = temp;
    }

    yearsKeys.map(year => {
      subportfolioBudgetList[`${year}`] = [];

      projectBudgetGroupedByYears[year].map(yearlyBudgetObj => {
        yearlyBudgetObj.projectBudgetCost.forEach(budgetObj => {
          budgetObj.budget.forEach(obj => {
            delete(obj.id);
            obj.portfolioId = yearlyBudgetObj.subPortfolio.portfolio;
            obj.subPortfolioId = yearlyBudgetObj.subPortfolio.id;
            obj.subPortfolioName = yearlyBudgetObj.subPortfolio.name;
          });

          subportfolioBudgetList[year].push(...budgetObj.budget)
        });
      });
    });

    const workbook = XLSX.utils.book_new();

    const generalsheet = XLSX.utils.json_to_sheet(generalList, {
      cellDates: true
    });
    XLSX.utils.book_append_sheet(workbook, generalsheet, 'General');

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

    yearsKeys.forEach(year => {
      let subPortfolioBudgetSheet = XLSX.utils.json_to_sheet(subportfolioBudgetList[year], {
        cellDates: true
      });
      XLSX.utils.book_append_sheet(workbook, subPortfolioBudgetSheet, `Sub-Port Budget ${year}`);
    });

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

    const filename = `Excel-Dump.xlsx`;
    XLSX.writeFile(workbook, filename);

    let promise = XlsxPopulate.fromFileAsync(process.cwd() + "/Excel-Dump.xlsx").then(workbookObj => {
      return workbookObj.toFileAsync("./Excel-Dump.xlsx", {
        password: "kitcHlew2020$"
      });
    });

    promise.then(success => {
      let newPath = process.cwd().split('\\');
      newPath.pop();
      newPath = newPath.join('\\');

      fs.rename(`${process.cwd()}/Excel-Dump.xlsx`, newPath + '\\uploads\\Excel-Dump.xlsx', err => {
        if (err) {
          throw err;
        }

        console.log('Excel Dump exported.');
      });
    });
  } catch (error) {
    console.log(error)
    ErrorsLogService.logError('Reports', error.toString(), 'uploadExcelDumpToDrive', req);
  }
};

module.exports = {
  cronJob,
}
