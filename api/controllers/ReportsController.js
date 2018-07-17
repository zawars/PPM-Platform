/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getReportsByUser: (req, res) => {
    Reports.find({
      user: req.params.id
    }).populate('user').then(reports => {
      res.ok(reports);
    });
  },

  getTeamReportsByUser: (req, res) => {
    Reports.find().populate('user').populate('project').populate('team').then(reports => {
      // res.ok(reports);
      let resultReports = [];
      reports.forEach((report, index) => {
        if (report.team) {
          let arr = report.team.forEach((obj) => {
            if (obj.name.id == req.params.id) {
              resultReports.push(report);
            }
          });
        }
      });
      res.ok(resultReports);
    });
  },
};
