/**
 * SubportfolioStatusReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  statusReportsbySubportfolio: (req, res) => {
    let subportfolioId = req.params.subportfolioId;
    SubportfolioStatusReport.find({
      subportfolio: subportfolioId
    }).populateAll().then(result => {
      res.ok(result);
    }).catch(error => {
      res.badRequest(error);
    })
  }
};
