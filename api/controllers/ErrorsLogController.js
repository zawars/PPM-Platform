/**
 * ErrorsLogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('errosLogsCount', async data => {
    try {
      let count = await ErrorsLog.count();
      socket.emit('errosLogsCount', count);
    } catch (error) {
    }
  })

  socket.on('errosLogsIndex', data => {
    ErrorsLog.find()
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(logs => {
        socket.emit('errosLogsIndex', logs);
      }).catch(error => {
      })
  })
});


module.exports = {
  

};

