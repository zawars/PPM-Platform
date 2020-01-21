/**
 * PortfolioBudgetYearController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getBudgetYears: async (req, res) => {
    try {
      let budgetYears = await PortfolioBudgetYear.find({ subPortfolio: req.params.id });
      res.ok(budgetYears);
    } catch (error) {
      res.badRequest(error);
    }
  },
};

