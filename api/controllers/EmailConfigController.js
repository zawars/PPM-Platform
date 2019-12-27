/**
 * EmailConfigController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('emailConfig', data => {
    EmailConfig.find().populateAll().then(emailConfigs => {
      socket.emit('emailConfig', emailConfigs)
    }).catch(err => {
      console.log(err);
    })
  })
})

module.exports = {


};
