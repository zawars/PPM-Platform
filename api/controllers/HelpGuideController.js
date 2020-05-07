/**
 * HelpGuideController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('helpGuideByFormName', async data => {
    try {
      let query = data.formName;
      let helpGuideObj = await HelpGuide.findOne({
        name: {
          'contains': query
        }
      }).populate('fields');

      socket.emit('helpGuideByFormName', helpGuideObj);
    } catch (error) {
      ErrorsLogService.logError('HelpGuide', `query : ${data.formName}, ` + error.toString(), 'helpGuideByFormName', socket.user.id);
    }
  });
});

module.exports = {
  getHelpGuideByFormName: async (req, res) => {
    try {
      let query = req.params.query;
      let helpGuideObj = await HelpGuide.findOne({
        name: {
          'contains': query
        }
      }).populate('fields');

      res.ok(helpGuideObj);
    } catch (error) {
      ErrorsLogService.logError('HelpGuide', `query : ${req.params.query}, ` + error.toString(), 'getHelpGuideByFormName', req);
      res.ok({
        message: 'Not found.',
        error
      });
    }
  },

};
