/**
 * StatusReportsController
 *
 * @description :: Server-side logic for managing Statusreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('prjectStatusReports', data => {
    StatusReports.find({
      projectReport: data.id
    }).then(reports => {
      socket.emit('prjectStatusReports', reports);
    }).catch(err => {
      ErrorsLogService.logError('Status Reports', `id: ${data.id}, ` + err.toString(), 'prjectStatusReports', '', socket.user.id);
      console.log(err);
    });
  });
})

module.exports = {
  getStatusReportsByProjectReport: (req, res) => {
    StatusReports.find({
      projectReport: req.params.id
    }).then(reports => {
      res.ok(reports);
    }).catch(err => {
      ErrorsLogService.logError('Status Reports', `id: ${req.params.id}, ` + err.toString(), 'getStatusReportsByProjectReport', req);
    })
  },
};
