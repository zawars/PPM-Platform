/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('updateFicoApprovalStatus', async data => {
    try {
      Reports.update({
        project: data.project
      }).set({
        ficoApprovedClosingReportDate: data.ficoApprovedClosingReportDate,
        isFicoApprovedClosingReport: data.isFicoApprovedClosingReport
      });
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'updateFicoApprovalStatus', '', socket.user.id);
    }
  });

  socket.on('selectiveReportsIndex', data => {
    let selectionIds = data.ids;
    Reports.find({
        id: selectionIds
      }).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().then(projects => {
        socket.emit('selectiveReportsIndex', projects);
      })
      .catch(error => {
        ErrorsLogService.logError('Reports', error.toString(), 'selectiveReportsIndex', '', socket.user.id);
      });
  });

  socket.on('selectiveReportsSearch', async data => {
    try {
      let search = data.search;
      let selectionIds = data.ids;

      let count = await Reports.count({
        or: [{
            uid: parseInt(search),
            id: selectionIds
          },
          {
            projectName: {
              contains: search
            },
            id: selectionIds
          },
          {
            'projectSponsor.name': {
              contains: search
            },
            id: selectionIds
          },
          {
            'projectManager.name': {
              contains: search
            },
            id: selectionIds
          },
          {
            status: {
              contains: search
            },
            id: selectionIds
          }
        ]
      });

      Reports.find({
          or: [{
              uid: parseInt(search),
              id: selectionIds
            },
            {
              projectName: {
                contains: search
              },
              id: selectionIds
            },
            {
              'projectSponsor.name': {
                contains: search
              },
              id: selectionIds
            },
            {
              'projectManager.name': {
                contains: search
              },
              id: selectionIds
            },
            {
              status: {
                contains: search
              },
              id: selectionIds
            }
          ]
        }).limit(10)
        .populateAll().then(projects => {
          socket.emit('selectiveReportsSearch', {
            count,
            projects
          });
        })
        .catch(error => {
          ErrorsLogService.logError('Reports', error.toString(), 'selectiveReportsSearch', '', socket.user.id);
        });
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'selectiveReportsSearch', '', socket.user.id);
    }
  });

  socket.on('selectiveReportsSearchIndex', async data => {
    let search = data.search;
    let selectionIds = data.ids;

    Reports.find({
        or: [{
            uid: parseInt(search),
            id: selectionIds
          },
          {
            projectName: {
              contains: search
            },
            id: selectionIds
          },
          {
            'projectSponsor.name': {
              contains: search
            },
            id: selectionIds
          },
          {
            'projectManager.name': {
              contains: search
            },
            id: selectionIds
          },
          {
            status: {
              contains: search
            },
            id: selectionIds
          }
        ]
      }).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().then(projects => {
        socket.emit('selectiveReportsSearchIndex', projects);
      })
      .catch(error => {
        ErrorsLogService.logError('Reports', error.toString(), 'selectiveReportsSearchIndex', '', socket.user.id);
      });
  });

  //To get count for all records
  socket.on('allReportsCount', async data => {
    try {
      let count = await Reports.count();
      socket.emit('allReportsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'allReportsCount', '', socket.user.id);
    }
  });

  //To paginate all records
  socket.on('allReportsIndex', data => {
    Reports.find()
      .paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().sort('uid DESC').then(projects => {
        socket.emit('allReportsIndex', projects);
      })
      .catch(error => {
        ErrorsLogService.logError('Reports', error.toString(), 'allReportsIndex', '', socket.user.id);
      });
  });

  //To search in data table of Reports
  socket.on('reportsSearch', async data => {
    let search = data.search;

    let count = await Reports.count({
      or: [{
          projectName: {
            'contains': search
          }
        },
        {
          uid: parseInt(search)
        }
      ]
    });

    Reports.find({
      or: [{
          projectName: {
            'contains': search
          }
        },
        {
          uid: parseInt(search)
        }
      ]
    }).limit(10).populateAll().sort('uid DESC').then(reportsResp => {
      socket.emit('reportsSearch', {
        count: count,
        reports: reportsResp
      });
    }).catch(error => {
      ErrorsLogService.logError('Reports', error.toString(), 'reportsSearch', '', socket.user.id);
    });
  });

  //To paginate search results of Reports
  socket.on('reportsSearchIndex', data => {
    let search = data.search;
    Reports.find({
      or: [{
          projectName: {
            'contains': search
          }
        },
        {
          uid: parseInt(search)
        }
      ]
    }).paginate({
      page: data.pageIndex,
      limit: data.pageSize
    }).populateAll().sort('uid DESC').then(reportsResp => {
      socket.emit('reportsSearchIndex', reportsResp);
    }).catch(error => {
      ErrorsLogService.logError('Reports', error.toString(), 'reportsSearchIndex', '', socket.user.id);
    });
  });

  //To get count
  socket.on('portfolioProjectsCount', async data => {
    try {
      let count = await Reports.count({});
      socket.emit('portfolioProjectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsCount', '', socket.user.id);
    }
  });

  //To paginate current user records
  socket.on('portfolioProjectsIndex', data => {
    Reports.find()
      .paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().then(projects => {
        socket.emit('portfolioProjectsIndex', projects);
      })
      .catch(error => {
        ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsIndex', '', socket.user.id);
      });
  });

  //To search in data table of Projects
  socket.on('portfolioProjectsSearch', async data => {
    let search = data.search.toLowerCase();
    let count = 0;
    try {
      await Reports.find({
        user: data.userId
      }).populateAll().then(projects => {
        let filteredProjects = projects.filter(project => {
          let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search) ||
            (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search)) ||
            (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search)) ||
            (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search)) ||
            (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search)) ||
            project.status.toLowerCase().includes(search);

          return check;
        });
        count = filteredProjects.length;
      });

      Reports.find({
        user: data.userId
      }).populateAll().then(projects => {
        let filteredProjects = projects.filter(project => {
          let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search) ||
            (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search)) ||
            (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search)) ||
            (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search)) ||
            (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search)) ||
            project.status.toLowerCase().includes(search);

          return check;
        })
        let paginatedProjects = SocketService.paginateArray(filteredProjects, 20, 1);
        socket.emit('portfolioProjectsSearch', {
          count: count,
          projects: paginatedProjects
        });
      });
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsSearch', '', socket.user.id);
    }
  });

  //To paginate search results of projects
  socket.on('portfolioProjectsSearchIndex', data => {
    let search = data.search;
    try {
      Reports.find({
        user: data.userId
      }).populateAll().then(projects => {
        let filteredProjects = projects.filter(project => {
          let check = project.uid == parseInt(search) || project.projectName.toLowerCase().includes(search) ||
            (project.projectManager.name && project.projectManager.name.toLowerCase().includes(search)) || (project.projectSponsor.name && project.projectSponsor.name.toLowerCase().includes(search)) ||
            (project.projectPhase.name && project.projectPhase.name.toLowerCase().includes(search)) || (project.businessArea.name && project.businessArea.name.toLowerCase().includes(search)) ||
            (project.businessSegment.name && project.businessSegment.name.toLowerCase().includes(search)) || (project.reportingLevel.name && project.reportingLevel.name.toLowerCase().includes(search)) ||
            (project.portfolio.name && project.portfolio.name.toLowerCase().includes(search)) || (project.strategicContribution.name && project.strategicContribution.name.toLowerCase().includes(search)) ||
            project.status.toLowerCase().includes(search);

          return check;
        })
        let paginatedProjects = SocketService.paginateArray(filteredProjects, data.pageSize, data.pageIndex);
        socket.emit('portfolioProjectsSearchIndex', paginatedProjects);
      });
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsSearchIndex', '', socket.user.id);
    }
  });

  socket.on('portfolioProjectsFilterCount', async data => {
    try {
      let filters = data.filtersArray;
      let filtersObj = {};

      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        filtersObj[key] = filter[key];
      })

      let count = await Reports.count({}).where(filtersObj);
      socket.emit('portfolioProjectsFilterCount', count);

    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsFilterCount', '', socket.user.id);
    }
  });

  socket.on('portfolioProjectsFilter', async data => {
    try {
      let filters = data.filtersArray;
      let filtersObj = {};

      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        filtersObj[key] = filter[key];
      })

      let reports = await Reports.find({}, {
        fields: {
          hasDraftReport: 0,
          budgetPlanningTable2: 0,
          budgetPlanningTable1: 0,
          actualCostTable: 0,
          reportRelevantRisksCount: 0,
          mileStonesValues: 0,
          risks: 0,
          user: 0,
          subProjects: 0,
          risksTable: 0,
          question: 0,
          quantitativeBenefit: 0,
          outOfScope: 0,
          mileStonesValues: 0,
          mandatoryProject: 0,
          involvedPartnersTable: 0,
          goals: 0,
          feasibility: 0,
          estimatedProjectTable: 0,
          estimatedProjectCostTableOutline: 0,
          documents: 0,
          deliverables: 0,
          currentReserveHistory: 0,
          threeYearsBudgetBreakdown: 0,
          trippleConstraint: 0,
          radarChartData: 0,
          projectOrganizationChart: 0,
          profitability: 0,
          prioritizationOld: 0,
          orderQuestion: 0,
          milestoneTable: 0,
          measures: 0,
          lessonsLearned: 0,
          impactedByDependenciesTable: 0,
          decisions: 0,
          communicationTable: 0,
          closingQuestion: 0,
          changeRequestQuestion: 0,
          classification: 0,
          businessUnit: 0,
          'pmoOfficer.tablesState': 0,
          'projectManager.tablesState': 0,
          'projectManager.projects': 0,
          'projectManager.teams': 0,
          'projectManager.configuration': 0,
          'projectSponsor.tablesState': 0,
          'projectFico.tablesState': 0
        }
      }).where(filtersObj).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populate('businessArea', {
        select: ['name']
      }).populate('businessSegment', {
        select: ['name']
      }).populate('itRelevant', {
        select: ['name']
      }).populate('portfolio', {
        select: ['name']
      }).populate('program', {
        select: ['programName']
      }).populate('project', {
        select: ['projectName']
      }).populate('projectMethodology', {
        select: ['name']
      }).populate('projectPhase', {
        select: ['name']
      }).populate('projectType', {
        select: ['name']
      }).populate('reportingLevel', {
        select: ['name']
      }).populate('strategicContribution', {
        select: ['name']
      }).populate('subPortfolio', {
        select: ['name']
      }).populate('statusReports', {
        select: [
          "overallStatus",
          "scopeStatus",
          "costStatus",
          "timeStatus",
          "riskStatus",
          "forecastEndDate",
          "startDate",
          "endDate",
          "plannedEndDate",
          "reportingDate",
          "EVA",
          "totalExposure",
          "riskExposureVsCurrentBudget",
          "plannedDateVSForecastDate",
          "currentBudgetVSForecast",
          "managementSummary",
          "percentageComplete"
        ]
      });

      socket.emit('portfolioProjectsFilter', reports);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsFilter', '', socket.user.id);
    }
  });

  socket.on('portfolioProjectsFilterIndex', data => {
    let filters = data.filtersArray;
    let filtersObj = {}
    try {
      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        filtersObj[key] = filter[key];
      })

      Reports.find({
        user: data.userId
      }).where(filtersObj).populateAll().then(projects => {
        let paginatedProjects = SocketService.paginateArray(projects, data.pageSize, data.pageIndex);
        socket.emit('portfolioProjectsFilterIndex', paginatedProjects);
      })
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'portfolioProjectsFilterIndex', '', socket.user.id);
    }
  });

  socket.on('fetchReport', async data => {
    try {
      let report = await Reports.findOne({
        id: data.id
      }).populateAll();
      socket.emit('fetchReport', report);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'fetchReport', '', socket.user.id);
    }
  });
});


module.exports = {
  getAllReports: async (req, res) => {
    try {
      let reports = await Reports.find().limit(req.query.limit || 10).populateAll().sort('uid DESC');
      res.ok(reports);
    } catch (error) {
      ErrorsLogService.logError('Reports', err.toString(), 'getReports', req);
    }
  },

  getReportsByUser: (req, res) => {
    Reports.find({
      user: req.params.id
    }).populate('user').then(reports => {
      res.ok(reports);
    }).catch(error => {
      ErrorsLogService.logError('Reports', error.toString(), 'getReportsByUser', req);
    })
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
    }).catch(error => {
      ErrorsLogService.logError('Reports', error.toString(), 'getTeamReportsByUser', req);
    })
  },

  budgetImport: async (req, res) => {
    try {
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
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'budgetImport', req);
    }
  },

  budgetSwitch: async (req, res) => {
    try {
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
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'budgetSwitch', req);
    }
  },

  projectsByPortfolio: async (req, res) => {
    try {
      let projects = await Reports.find({
        portfolio: req.body.portfolioId
      }).populateAll();

      projects = projects.filter(project => {
        if (project.subPortfolio != undefined) {
          return project.subPortfolio == req.body.subPortfolio;
        }
      });

      res.ok(projects);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'projectsByPortfolio', req);
    }
  },

  getProjectsBySubPortfolio: async (req, res) => {
    let data = req.params;

    let subportfolioProjects = await Reports.find({
      portfolio: data.id,
      subPortfolio: data.subPortfolio
    }).populateAll();

    res.ok(subportfolioProjects);
  },

  searchProjectsReports: async (req, res) => {
    let search = req.params.query;

    try {
      let projects = await Reports.find({
        or: [{
            uid: parseInt(search)
          },
          {
            projectName: {
              contains: search
            }
          }
        ]
      }).limit(10).sort('uid DESC');

      res.send(projects);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'searchProjectsReports', req);
    }
  },

  update: async (req, res) => {
    try {
      let data = req.body;

      // Update Subportfolio Budget
      if (data.subPortfolio != undefined && data.subPortfolio != "") {
        // Move budget to new subportfolio from old one.
      }

      await Reports.update({
        id: req.params.id
      }).set(data);

      let report = await Reports.findOne({
        id: req.params.id
      }).populateAll();

      res.ok(report);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'update', req);
    }
  },

  getReportsDocumentsAnswers: async (req, res) => {
    try {
      let documentAnswers = await Reports.find({
        id: req.params.id
      }, {
        fields: {
          question: 1,
          orderQuestion: 1,
          changeRequestQuestion: 1,
          closingQuestion: 1
        }
      });

      res.send(documentAnswers);
    } catch (error) {
      ErrorsLogService.logError('Reports', error.toString(), 'getReportsDocumentsAnswers', req);
    }
  }
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
