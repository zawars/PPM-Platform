/**
 * SubPortfolioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createSubportfolio: (req, res) => {
    SubPortfolio.create({
      name: req.body.name,
      portfolio: req.body.portfolio
    }).then(createdSubportfolio => {
      PortfolioBudgetYear.create({
        year: new Date().getFullYear(),
        subPortfolio: createdSubportfolio.id
      }).then(createdPortfolioBudgetYear => {
        SubPortfolio.update({
          id: createdSubportfolio.id
        }).set({
          currentYear: createdPortfolioBudgetYear.id
        }).then(response => {
          res.ok(response[0]);
        }).catch(error => {
          ErrorsLogService.logError('Subportfolio', error.toString(), 'createSubportfolio', req);
        })
      }).catch(error => {
        ErrorsLogService.logError('Subportfolio', error.toString(), 'createSubportfolio', req);
      })
    }).catch(error => {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'createSubportfolio', req);
    })
  }
};
