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
      });
      res.ok(budgetYears);
    } catch (error) {
      ErrorsLogService.logError('Portfolio Budget Year', error.toString(), 'getBudgetYears', req);
      res.badRequest(error);
    }
  },

  fixYearlyBudget: async (req, res) => {
    try {
      let budgetYear = req.body.budgetYear;

      let projectBudgetCost = await ProjectBudgetCost.find({
        portfolioBudgetYear: budgetYear
      });

      let totalBudget = 0;
      let totalOwnIT = 0;
      let totalThereofICT = 0;
      let totalExternalIT = 0;

      if (projectBudgetCost.length > 0) {
        projectBudgetCost.forEach(project => {
          totalBudget += parseInt(project.budget[6].budget || 0);
          totalOwnIT += parseInt(project.budget[6].ownIT || 0);
          totalThereofICT += parseInt(project.budget[6].thereofICT || 0);
          totalExternalIT += parseInt(project.budget[6].externalIT || 0);
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
          totalFixedOwnIT: totalOwnIT,
          totalFixedThereofICT: totalThereofICT,
          totalFixedExternalIT: totalExternalIT
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
              yearly_Budget_Fixed: project.budget[i].budget
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

        res.ok(PortfolioBudgetYearUpdated);
      } else {
        res.ok("Projects Not Found");
      }
    } catch (error) {
      ErrorsLogService.logError('Portfolio Budget Year', error.toString(), 'fixYearlyBudget', req);
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

        let totalBudget = 0;
        let totalOwnIT = 0;
        let totalThereofICT = 0;
        let totalExternalIT = 0;

        if (projectBudgetCost.length > 0) {
          projectBudgetCost.forEach(project => {
            totalBudget += parseInt(project.budget[6].budget || 0);
            totalOwnIT += parseInt(project.budget[6].ownIT || 0);
            totalThereofICT += parseInt(project.budget[6].thereofICT || 0);
            totalExternalIT += parseInt(project.budget[6].externalIT || 0);
          })

          let PortfolioBudgetYearUpdated = await PortfolioBudgetYear.update({
            id: budgetYears[i].id
          }).set({
            totalFixedBudget: totalBudget,
            totalFixedOwnIT: totalOwnIT,
            totalFixedThereofICT: totalThereofICT,
            totalFixedExternalIT: totalExternalIT
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
                yearly_Budget_Fixed: project.budget[i].budget
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
      ErrorsLogService.logError('Portfolio Budget Year', error.toString(), 'fixYearlyBudget', req);
      res.badRequest(error);
    }
  }
};
