/**
 * ProjectBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  deleteProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      await ProjectBudgetCost.destroy({ 'project': id });
      res.ok({ message: 'Deleted Project Budget Cost' });
    } catch (e) {
      res.badRequest(e);
    }
  },

  getProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      let budget = await ProjectBudgetCost.find({ 'project': id }).populateAll();
      res.ok(budget);
    } catch (e) {
      res.badRequest(e);
    }
  },

  budgetsByYear: async (req, res) => {
    try {
      let results = await ProjectBudgetCost.find({
        portfolioBudgetYear: req.params.id
      }).populateAll();

      res.ok(results);
    } catch (error) {
      res.ok({ error });
    }
  }

};

