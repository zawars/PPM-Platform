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

        let PortfolioBudgetYearUpdated = await PortfolioBudgetYear.update({
          id: budgetYear
        }).set({
          totalFixedBudget: totalBudget,
          totalFixedOwnIT: totalOwnIT,
          totalFixedThereofICT: totalThereofICT,
          totalFixedExternalIT: totalExternalIT
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

          await PortfolioBudgetYear.update({
            id: budgetYears[i].id
          }).set({
            totalFixedBudget: totalBudget,
            totalFixedOwnIT: totalOwnIT,
            totalFixedThereofICT: totalThereofICT,
            totalFixedExternalIT: totalExternalIT
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
