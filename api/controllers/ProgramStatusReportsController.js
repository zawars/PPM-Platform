/**
 * ProgramStatusReportsController
 *
 * @description :: Server-side logic for managing Programstatusreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getStatusReportsByProgram: (req, res) => {
      ProgramStatusReports.find({
        program: req.params.id
      }).then(reports => {
        res.ok(reports);
      }).catch(err => {
        res.badRequest(err);
      });
    },
  };
  