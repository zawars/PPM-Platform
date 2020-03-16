/**
 * SubPortfolioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    try {
      let createdSubportfolio = await SubPortfolio.create({
        name: req.body.name,
        portfolio: req.body.portfolio,
        subPortfolioManager: req.body.subPortfolioManager,
        statusReportReminder: req.body.statusReportReminder   // statusReportReminder value is used to how many days after send email reminder those project managers whose do not create a status report according to current date  
      })
      let createdPortfolioBudgetYear = await PortfolioBudgetYear.create({
        year: new Date().getFullYear(),
        subPortfolio: createdSubportfolio.id
      })
      let response = await SubPortfolio.update({
        id: createdSubportfolio.id
      }).set({
        currentYear: createdPortfolioBudgetYear.id
      });

      await User.update({
        id: req.body.subPortfolioManager.id
      }).set({
        isSubportfolioManager: true
      });

      res.ok(response[0]);
    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'createSubportfolio', req);
    }
  }
};
