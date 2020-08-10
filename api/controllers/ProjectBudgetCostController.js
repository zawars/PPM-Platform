/**
 * ProjectBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const moment = require('moment');
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('projectBudget', async data => {
    try {
      let id = data.id;
      let budget = await ProjectBudgetCost.find({
        'project': id
      }).populateAll();
      socket.emit('projectBudget', budget);
    } catch (err) {
      ErrorsLogService.logError('Project Budget Cost', `id: ${data.id}, ` + err.toString(), 'projectBudget', '', socket.user.id);
    }
  })

  // socket.on('projectBudgetByYearCount', async data => {
  //   try {
  //     let result = await ProjectBudgetCost.count({
  //       portfolioBudgetYear: data.id
  //     });
  //     socket.emit('projectBudgetByYearCount', result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearSearch', async data => {
  //   let search = data.search.toLowerCase();
  //   let count = 0;

  //   try {
  //     let results = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).populateAll();

  //     let searchResults = results.filter(result => {
  //       let check = result.project.uid == parseInt(search) || result.project.projectName.toLowerCase().includes(search)
  //         || (result.project.status && result.project.status.toLowerCase().includes(search));

  //       return check;
  //     });

  //     count = searchResults.length;
  //     let paginatedResults = SocketService.paginateArray(searchResults, 10, 1);
  //     socket.emit('projectBudgetByYearSearch', { count, projects: paginatedResults });

  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearSearchIndex', async data => {
  //   let search = data.search.toLowerCase();

  //   try {
  //     let results = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).populateAll();

  //     let searchResults = results.filter(result => {
  //       let check = result.project.uid == parseInt(search) || result.project.projectName.toLowerCase().includes(search)
  //         || (result.project.status && result.project.status.toLowerCase().includes(search));

  //       return check;
  //     });

  //     let paginatedResults = SocketService.paginateArray(searchResults, data.pageSize, data.pageIndex);
  //     socket.emit('projectBudgetByYearSearchIndex', paginatedResults);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearIndex', async data => {
  //   try {
  //     let result = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).paginate({ page: data.pageIndex, limit: data.pageSize })
  //       .populateAll();

  //     socket.emit('projectBudgetByYearIndex', result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

});

module.exports = {

  deleteProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      await ProjectBudgetCost.destroy({
        project: id
      });
      res.ok({
        message: 'Deleted Project Budget Cost'
      });
    } catch (e) {
      ErrorsLogService.logError('Project Budget Cost', `id: ${req.params.id}, ` + e.toString(), 'deleteProjectBudget', req);
      res.badRequest(e);
    }
  },

  getProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      let results = await ProjectBudgetCost.find({
        project: id
      }).populateAll();

      if (results.length > 0) {
        let report;

        for (let i = 0; i < results.length; i++) {
          if (i == 0) {
            report = await Reports.findOne({
              where: {
                project: id
              },
              select: ['costTypeTable']
            });
          }

          if (report && report.costTypeTable) {
            for (let j = 0; j < 7; j++) {
              results[i].budget[j].remainingProjectBudget = parseInt(report.costTypeTable[j].currentBudget || 0) - parseInt(report.costTypeTable[j].actualCost || 0);
            }
          }
        }

        res.ok(results);

      } else {
        res.ok([]);
      }
    } catch (e) {
      ErrorsLogService.logError('Project Budget Cost', `id: ${req.params.id}, ` + e.toString(), 'getProjectBudget', req);
      res.badRequest(e);
    }
  },

  //It retrieves all projects' budget cost for a selected Budget Year
  budgetsByYear: async (req, res) => {
    ProjectBudgetCost.native(async function (err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([{
          $lookup: {
            from: "projects",
            localField: 'project',
            foreignField: '_id',
            as: "projectitem"
          }
        },
        {
          $unwind: '$projectitem'
        },
        {
          $lookup: {
            from: "reports",
            let: {
              project: '$project'
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $eq: ["$project", "$$project"]
                  },
                }
              },
              {
                $project: {
                  status: 1,
                  itPlatform: 1,
                  plannedEndDate: 1,
                  costTypeTable: 1
                }
              }
            ],
            as: "report"
          }
        },
        {
          $unwind: {
            path: '$report',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).toArray(function (err, results = []) {
        if (err) return ErrorsLogService.logError('Project Budget Cost', `id: ${req.params.id}, ` + err.toString(), 'budgetsByYear', req);

        let finalResult = results.filter(result => {
          return result.portfolioBudgetYear == req.params.id;
        })

        finalResult.forEach(result => {
          if (result.report && result.report.costTypeTable) {
            for (let i = 0; i < 7; i++) {
              result.budget[i].remainingProjectBudget = parseInt(result.report.costTypeTable[i].currentBudget || 0) - parseInt(result.report.costTypeTable[i].actualCost || 0);
              result.budget[i].currentBudget = parseInt(result.report.costTypeTable[i].currentBudget || 0);
            }
          }
        });

        res.ok(finalResult);
      })
    });
  },

  createProjectBudgetCost: async (req, res) => {
    try {
      let portfolioBudgetYear = await PortfolioBudgetYear.findOne({
        id: req.body.portfolioBudgetYear
      });

      let budget = req.body.budget;
      if (portfolioBudgetYear.additionalColumns && portfolioBudgetYear.additionalColumns.length > 0) {
        let additionalColumns = portfolioBudgetYear.additionalColumns;

        for (let i = 0; i < additionalColumns.length; i++) {
          for (let j = 0; j < budget.length; j++) {
            budget[j][additionalColumns[i].dataField] = '';
          }
        }
      }

      let createdCost = await ProjectBudgetCost.create({
        portfolioBudgetYear: req.body.portfolioBudgetYear,
        project: req.body.project,
        budget: budget
      });

      res.ok(createdCost);

    } catch (error) {
      ErrorsLogService.logError('Project Budget Cost', error.toString(), 'createProjectBudgetCost', req);
    }
  },

  updateMultipleProjectsBudget: async (req, res) => {
    try {
      let projectsBudget = req.body.projectsBudget;
      let docLink = req.body.documentLink;
      let subPortfolioId = req.body.subPortfolioId;
      let ordersBudget = req.body.ordersBudget;

      if (ordersBudget.length > 0) {
        for (let i = 0; i < ordersBudget.length; i++) {
          await OrderBudgetCost.update({
              id: ordersBudget[i].id
            })
            .set({
              budget: ordersBudget[i].budget
            })
        }
      }

      projectsBudget.forEach(async (project, index) => {
        let result = await ProjectBudgetCost.update({
            id: project.id
          })
          .set({
            budget: project.budget
          })

        if (index == projectsBudget.length - 1) {
          if (docLink) {
            // update SubPortfolio with document link
            await SubPortfolio.update({
              id: subPortfolioId
            }).set({
              documentLink: docLink
            });
          }
          res.ok(result);
        }
      });
    } catch (error) {
      ErrorsLogService.logError('Project Budget Cost', error.toString(), 'updateMultipleProjectsBudget', req);
    }
  },

  createBudgetByYear: async (req, res) => {
    let subPortfolio = req.body.subPortfolio;
    let portfolioBudgetYear = req.body.portfolioBudgetYear;
    let year = req.body.year;
    let budget = [{
      costType: "External Costs",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 0,
      group: "CAPEX",
    }, {
      costType: "Internal Costs",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 1,
      group: "CAPEX",
    }, {
      costType: "External Costs",
      budget: '',
      thereofIT: '',
      currentBudget: "",
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 2,
      group: "OPEX"
    }, {
      costType: "Internal Costs",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 3,
      group: "OPEX"
    }, {
      costType: "Revenues",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 4,
      group: "Sonstiges",
    }, {
      costType: "Reserves",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      group: "Sonstiges",
      id: 5,
    }, {
      costType: "Total",
      budget: '',
      thereofIT: '',
      currentBudget: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 6,
      group: "Sonstiges",
    }, ];

    try {
      let smallOrders = await SmallOrder.find({
        or: [{
            status: 'Start',
            subPortfolio: subPortfolio
          },
          {
            status: 'Closed',
            subPortfolio: subPortfolio,
            endDate: {
              contains: year
            }
          }
        ]
      });

      if (smallOrders.length > 0) {
        smallOrders.forEach(async (order, index) => {
          await OrderBudgetCost.create({
            portfolioBudgetYear: portfolioBudgetYear,
            order: order.id,
            budget: budget
          }).then(result => {
            //
          }).catch(error => {
            ErrorsLogService.logError('Order Budget Cost', error.toString(), 'createBudgetByYear', req);
            res.badRequest({
              error
            });
          });
        });
      }

      let subportfolioProjects = await Reports.find({
        or: [{
            status: 'Active',
            subPortfolio: subPortfolio
          },
          {
            status: 'Closed',
            isFicoApprovedClosingReport: true,
            ficoApprovedClosingReportDate: {
              contains: year
            },
            subPortfolio: subPortfolio
          }
        ]
      });

      if (subportfolioProjects.length > 0) {
        subportfolioProjects.forEach((project, index) => {
          ProjectBudgetCost.create({
            portfolioBudgetYear: portfolioBudgetYear,
            project: project.projectId,
            budget: budget
          }).then(result => {
            if (index == subportfolioProjects.length - 1) {
              res.ok(result);
            }
          }).catch(error => {
            ErrorsLogService.logError('Project Budget Cost', error.toString(), 'createBudgetByYear', req);
            res.badRequest({
              error
            });
          });
        });
      } else {
        res.ok({
          message: "Year Added"
        });
      }
    } catch (error) {
      ErrorsLogService.logError('Project Budget Cost', error.toString(), 'createBudgetByYear', req);
    }
  },

  switchYearlyBudget: async (req, res) => {
    try {
      let body = req.body;

      await ProjectBudgetCost.destroy({
        project: body.project
      });

      let subPortfolio = await SubPortfolio.findOne({
        id: body.subPortfolio
      }).populateAll();

      let costYearIds = [];
      subPortfolio.costYears.map(val => costYearIds.push(val.id));

      let obj = [];
      costYearIds.map(val => obj.push({
        budget: body.budget,
        portfolioBudgetYear: val,
        project: body.project
      }));

      let projectBudgetCost = await ProjectBudgetCost.createEach(obj);
      await Projects.update({
        id: body.project
      }).set({
        subPortfolio: subPortfolio.id
      });

      res.ok({
        message: 'Project Yearly Budget created.'
      });
    } catch (error) {
      ErrorsLogService.logError('Project Budget Switch', `id: ${body.project}, ` + error.toString(), 'switchYearlyBudget', req);
      res.badRequest({
        message: error.message
      });
    }
  },

  createProjectBudgetForSubportfolio: async (req, res) => {
    try {
      let currentYear = moment().format('YYYY');

      let subportfolioBudgetYears = await PortfolioBudgetYear.find({
        subPortfolio: req.body.subPortfolio,
        year: {
          '>=': currentYear
        }
      });

      let objects = [];
      for (let i = 0; i < subportfolioBudgetYears.length; i++) {
        objects.push({
          project: req.body.project,
          budget: req.body.budget,
          portfolioBudgetYear: subportfolioBudgetYears[i].id
        })
      }

      let projectBudgetCosts = await ProjectBudgetCost.createEach(objects);

      res.send(projectBudgetCosts);
    } catch (error) {
      ErrorsLogService.logError('Project Budget Switch', `id: ${body.project}, ` + error.toString(), 'createProjectBudgetForSubportfolio', req);
      res.badRequest({
        message: error.message
      });
    }
  }

};
