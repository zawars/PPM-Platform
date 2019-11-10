/**
 * PortfolioController
 *
 * @description :: Server-side logic for managing Portfolios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getActivePortfolios: (req, res) => {
    Portfolio.find({
      status: "Active"
    }).populate('reports').then(response => {
      res.ok(response);
    }).catch(err => {
      res.badRequest(err);
    });
  },
};
