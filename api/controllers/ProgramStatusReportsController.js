/**
 * ProgramStatusReportsController
 *
 * @description :: Server-side logic for managing Programstatusreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('programStatusReports', data => {
    ProgramStatusReports.find({
      program: data.id
    }).then(reports => {
      socket.emit('programStatusReports', reports);
    }).catch(error => {
      ErrorsLogService.logError('Program Status Reports', `id: ${data.id}, ` + error.toString(), 'programStatusReports', '', socket.user.id);
    });
  });
})

module.exports = {
  getStatusReportsByProgram: (req, res) => {
    ProgramStatusReports.find({
      program: req.params.id
    }).then(reports => {
      res.ok(reports);
    }).catch(err => {
      ErrorsLogService.logError('Program Status Reports', `id: ${req.params.id}, ` + err.toString(), 'getStatusReportsByProgram', req);
      res.badRequest(err);
    });
  },
};
