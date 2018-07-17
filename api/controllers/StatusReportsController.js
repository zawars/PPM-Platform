/**
 * StatusReportsController
 *
 * @description :: Server-side logic for managing Statusreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getStatusReportsByProjectReport: (req, res) => {
    StatusReports.find({
      projectReport: req.params.id
    }).then(reports => {
      res.ok(reports);
    });
  },
};
