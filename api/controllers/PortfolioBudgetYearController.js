/**
 * PortfolioBudgetYearController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getBudgetYears: async (req, res) => {
    try {
      let budgetYears = await PortfolioBudgetYear.find({
        subPortfolio: req.params.id
      }).sort('year ASC');

      res.ok(budgetYears);
    } catch (error) {
      res.badRequest(error);
    }
  },

  fixYearlyBudget: async (req, res) => {
    try {
      let budgetYear = req.body.budgetYear;

      let projectBudgetCost = await ProjectBudgetCost.find({
        portfolioBudgetYear: budgetYear
      });

      let orderBudgetCost = await OrderBudgetCost.find({
        portfolioBudgetYear: budgetYear
      });

      let totalBudget = 0;
      let totalThereofIT = 0;
      let totalOwnIT = 0;
      let totalThereofICT = 0;
      let totalExternalIT = 0;
      let totalopexCapexExternal = 0;
      let totalCapex = 0;

      if (projectBudgetCost.length > 0 || orderBudgetCost.length > 0) {
        projectBudgetCost.forEach(project => {
          totalBudget += parseInt(project.budget[6].budget || 0);
          totalThereofIT += parseInt(project.budget[6].thereofIT || 0);
          totalOwnIT += parseInt(project.budget[1].thereofIT || 0) + parseInt(project.budget[3].thereofIT || 0);
          totalThereofICT += parseInt(project.budget[6].davon_GE_ICT || 0);
          totalExternalIT += parseInt(project.budget[0].thereofIT || 0) + parseInt(project.budget[2].thereofIT || 0);
          totalopexCapexExternal += parseInt(project.budget[0].budget || 0) + parseInt(project.budget[2].budget || 0);
          totalCapex += parseInt(project.budget[0].budget || 0) + parseInt(project.budget[1].budget || 0);
        })

        orderBudgetCost.forEach(order => {
          totalBudget += parseInt(order.budget[6].budget || 0);
          totalThereofIT += parseInt(order.budget[6].thereofIT || 0);
          totalOwnIT += parseInt(order.budget[1].thereofIT || 0) + parseInt(order.budget[3].thereofIT || 0);
          totalThereofICT += parseInt(order.budget[6].davon_GE_ICT || 0);
          totalExternalIT += parseInt(order.budget[0].thereofIT || 0) + parseInt(order.budget[2].thereofIT || 0);
          totalopexCapexExternal += parseInt(order.budget[0].budget || 0) + parseInt(order.budget[2].budget || 0);
          totalCapex += parseInt(order.budget[0].budget || 0) + parseInt(order.budget[1].budget || 0);
        })

        let fixedColumns = [{
          caption: 'Yearly Budget Fixed',
          dataField: 'Yearly_Budget_Fixed'
        }, {
          caption: 'thereof IT Fixed',
          dataField: 'thereof_IT_Fixed'
        }];

        let PortfolioBudgetYearUpdated = await PortfolioBudgetYear.update({
          id: budgetYear
        }).set({
          totalFixedBudget: totalBudget,
          totalFixedthereofIT: totalThereofIT,
          totalFixedOwnIT: totalOwnIT,
          totalFixedThereofICT: totalThereofICT,
          totalFixedExternalIT: totalExternalIT,
          totalFixedopexCapexExternal: totalopexCapexExternal,
          totalFixedCapex: totalCapex
        });

        let isdavonGEFixed = false;
        let additionalColumns = PortfolioBudgetYearUpdated[0].additionalColumns ? PortfolioBudgetYearUpdated[0].additionalColumns : [];

        if (additionalColumns.length > 0) {
          additionalColumns.forEach(additionalColumn => {
            if (additionalColumn.caption.includes('davon GE ICT')) {
              isdavonGEFixed = true;
              let davonGEFixed = {
                caption: 'davon GE ICT Fixed',
                dataField: 'davon_GE_ICT_Fixed'
              }
              fixedColumns.push(davonGEFixed);
            }
          })
        }

        let portfolioBudgetYearUpdatedAgain = await PortfolioBudgetYear.update({
          id: budgetYear
        }).set({
          fixedColumns: fixedColumns
        });

        orderBudgetCost.forEach(async order => {
          for (let i = 0; i < 6; i++) {
            let temp = Object.assign({}, order.budget[i]);
            delete temp.Yearly_Budget_Fixed;
            delete temp.thereof_IT_Fixed;
            delete temp.davon_GE_ICT_Fixed;

            let davonGEFixedObj = isdavonGEFixed ? {
              davon_GE_ICT_Fixed: order.budget[i].davon_GE_ICT
            } : {};

            order.budget[i] = Object.assign({}, temp, {
              Yearly_Budget_Fixed: order.budget[i].budget
            }, {
              thereof_IT_Fixed: order.budget[i].thereofIT
            }, davonGEFixedObj);
          }

          let result = await OrderBudgetCost.update({
            id: order.id
          }).set({
            budget: order.budget
          })
        });

        projectBudgetCost.forEach(async project => {
          for (let i = 0; i < 6; i++) {
            let temp = Object.assign({}, project.budget[i]);
            delete temp.Yearly_Budget_Fixed;
            delete temp.thereof_IT_Fixed;
            delete temp.davon_GE_ICT_Fixed;

            let davonGEFixedObj = isdavonGEFixed ? {
              davon_GE_ICT_Fixed: project.budget[i].davon_GE_ICT
            } : {};

            project.budget[i] = Object.assign({}, temp, {
              Yearly_Budget_Fixed: project.budget[i].budget
            }, {
              thereof_IT_Fixed: project.budget[i].thereofIT
            }, davonGEFixedObj);
          }

          let result = await ProjectBudgetCost.update({
            id: project.id
          }).set({
            budget: project.budget
          })
        });

        //Marking Subportfolio as Fixed so that it can't be deleted
        await SubPortfolio.update({
          id: portfolioBudgetYearUpdatedAgain[0].subPortfolio
        }).set({
          isFixed: true
        });

        res.ok(PortfolioBudgetYearUpdated);
      } else {
        res.ok("Projects Not Found");
      }
    } catch (error) {
      res.badRequest(error);
    }
  },

  fixAllYearlyBudget: async (req, res) => {
    try {
      let budgetYears = await PortfolioBudgetYear.find();

      for (let i = 0; i < budgetYears.length; i++) {
        let projectBudgetCost = await ProjectBudgetCost.find({
          portfolioBudgetYear: budgetYears[i].id
        });


        let orderBudgetCost = await OrderBudgetCost.find({
          portfolioBudgetYear: budgetYears[i].id
        });

        //Marking Subportfolio as Fixed so that it can't be deleted
        await SubPortfolio.update({
          id: budgetYears[i].subPortfolio
        }).set({
          isFixed: true
        });


        let totalBudget = 0;
        let totalThereofIT = 0;
        let totalOwnIT = 0;
        let totalThereofICT = 0;
        let totalExternalIT = 0;
        let totalopexCapexExternal = 0;
        let totalCapex = 0;

        if (projectBudgetCost.length > 0) {
          projectBudgetCost.forEach(project => {
            totalBudget += parseInt(project.budget[6].budget || 0);
            totalThereofIT += parseInt(project.budget[6].thereofIT || 0);
            totalOwnIT += parseInt(project.budget[1].thereofIT || 0) + parseInt(project.budget[3].thereofIT || 0);
            totalThereofICT += parseInt(project.budget[6].davon_GE_ICT || 0);
            totalExternalIT += parseInt(project.budget[0].thereofIT || 0) + parseInt(project.budget[2].thereofIT || 0);
            totalopexCapexExternal += parseInt(project.budget[0].budget || 0) + parseInt(project.budget[2].budget || 0);
            totalCapex += parseInt(project.budget[0].budget || 0) + parseInt(project.budget[1].budget || 0);
          })

          orderBudgetCost.forEach(order => {
            totalBudget += parseInt(order.budget[6].budget || 0);
            totalThereofIT += parseInt(order.budget[6].thereofIT || 0);
            totalOwnIT += parseInt(order.budget[1].thereofIT || 0) + parseInt(order.budget[3].thereofIT || 0);
            totalThereofICT += parseInt(order.budget[6].davon_GE_ICT || 0);
            totalExternalIT += parseInt(order.budget[0].thereofIT || 0) + parseInt(order.budget[2].thereofIT || 0);
            totalopexCapexExternal += parseInt(order.budget[0].budget || 0) + parseInt(order.budget[2].budget || 0);
            totalCapex += parseInt(order.budget[0].budget || 0) + parseInt(order.budget[1].budget || 0);
          })


          let PortfolioBudgetYearUpdated = await PortfolioBudgetYear.update({
            id: budgetYears[i].id
          }).set({
            totalFixedBudget: totalBudget,
            totalFixedthereofIT: totalThereofIT,
            totalFixedOwnIT: totalOwnIT,
            totalFixedThereofICT: totalThereofICT,
            totalFixedExternalIT: totalExternalIT,
            totalFixedopexCapexExternal: totalopexCapexExternal,
            totalFixedCapex: totalCapex
          });

          let fixedColumns = [{
            caption: 'Yearly Budget Fixed',
            dataField: 'Yearly_Budget_Fixed'
          }, {
            caption: 'thereof IT Fixed',
            dataField: 'thereof_IT_Fixed'
          }];

          let isdavonGEFixed = false;
          let additionalColumns = PortfolioBudgetYearUpdated[0].additionalColumns ? PortfolioBudgetYearUpdated[0].additionalColumns : [];

          if (additionalColumns.length > 0) {
            additionalColumns.forEach(additionalColumn => {
              if (additionalColumn.caption.includes('davon GE ICT')) {
                isdavonGEFixed = true;
                let davonGEFixed = {
                  caption: 'davon GE ICT Fixed',
                  dataField: 'davon_GE_ICT_Fixed'
                }
                fixedColumns.push(davonGEFixed);
              }
            })
          }

          await PortfolioBudgetYear.update({
            id: budgetYears[i].id
          }).set({
            fixedColumns: fixedColumns
          });

          orderBudgetCost.forEach(async order => {
            for (let i = 0; i < 6; i++) {
              let temp = Object.assign({}, order.budget[i]);
              delete temp.Yearly_Budget_Fixed;
              delete temp.thereof_IT_Fixed;
              delete temp.davon_GE_ICT_Fixed;

              let davonGEFixedObj = isdavonGEFixed ? {
                davon_GE_ICT_Fixed: order.budget[i].davon_GE_ICT
              } : {};

              order.budget[i] = Object.assign({}, temp, {
                Yearly_Budget_Fixed: order.budget[i].budget
              }, {
                thereof_IT_Fixed: order.budget[i].thereofIT
              }, davonGEFixedObj);
            }

            let result = await OrderBudgetCost.update({
              id: order.id
            }).set({
              budget: order.budget
            })
          });

          projectBudgetCost.forEach(async project => {
            for (let i = 0; i < 6; i++) {
              let temp = Object.assign({}, project.budget[i]);
              delete temp.Yearly_Budget_Fixed;
              delete temp.thereof_IT_Fixed;
              delete temp.davon_GE_ICT_Fixed;

              let davonGEFixedObj = isdavonGEFixed ? {
                davon_GE_ICT_Fixed: project.budget[i].davon_GE_ICT
              } : {};

              project.budget[i] = Object.assign({}, temp, {
                Yearly_Budget_Fixed: project.budget[i].budget
              }, {
                thereof_IT_Fixed: project.budget[i].thereofIT
              }, davonGEFixedObj);
            }

            let result = await ProjectBudgetCost.update({
                id: project.id
              })
              .set({
                budget: project.budget
              })
          });
        }

        if (i == budgetYears.length - 1) {
          res.ok([]);
        }

      }
    } catch (error) {
      res.badRequest(error);
    }
  },

  multiYearlyBudget: async (req, res) => {
    let subPortfolioBudgetYearList = await PortfolioBudgetYear.find({
      subPortfolio: req.params.id
    }).populateAll();

    let data = {};

    subPortfolioBudgetYearList.map(subportfolioBudgetYear => {
      subportfolioBudgetYear.projectBudgetCost.map(val => {
        if (data[val.project] == undefined) {
          data[val.project] = {};
          data[val.project].total = 0;
          data[val.project].years = [];
        }

        data[val.project][subportfolioBudgetYear.year] = val.budget[6].budget;
        data[val.project].total += data[val.project][subportfolioBudgetYear.year];
        data[val.project].years.push(subportfolioBudgetYear.year);
      });
    });

    let keys = Object.keys(data);
    let projects = await Projects.find({
      id: keys,
      mode: 'project'
    }).populate('projectReport');

    let result = [];
    projects.map(val => {
      result.push({
        id: val.uid,
        projectName: val.projectName,
        ...data[val.id],
        status: val.projectReport.status
      });
    });

    res.ok(result)
  },

  getProjectYearlyBudgets: async (req, res) => {
    try {
      let budgetYears = await PortfolioBudgetYear.find({
        subPortfolio: req.params.id
      }).sort('year ASC').populateAll();

      let projectsIds = [];
      if (budgetYears && budgetYears.length > 0) {
        budgetYears.map(budgetYear => {
          budgetYear.projectBudgetCost.map(budget => {
            if (projectsIds.findIndex(val => val == budget.project) < 0) {
              projectsIds.push(budget.project);
            }
          });
        });
      }

      let projects = await Projects.find({
        id: {
          $in: projectsIds
        }
      }).populateAll();

      let projectYearlyBudgets = [];
      if (projects.length > 0) {
        budgetYears.map(budgetYear => {
          budgetYear.projectBudgetCost.map(projectBudget => {
            let project = projects.find(val => val.id == projectBudget.project);
            if (project && project.mode != 'bucket' && projectBudget.budget && projectBudget.budget.length > 0) {
              projectYearlyBudgets.push({
                // id: project.uid,
                name: project.uid + ' - ' + project.projectName,
                status: project.projectReport ? project.projectReport.status : '',
                budget: projectBudget.budget[6].budget,
                year: budgetYear.year //new Date(`${budgetYear.year}-12-01`)  
              });
            }
          });
        });
      }

      res.ok(projectYearlyBudgets);
    } catch (error) {
      res.badRequest(error);
    }
  },
};
