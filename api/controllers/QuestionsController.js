/**
 * QuestionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('questionsByFormName', async data => {
    try {
      let query = data.formName;
      let questionsObj = await Questions.findOne({
        name: {
          'contains': query
        }
      }).populate('questions');

      socket.emit('questionsByFormName', questionsObj);
    } catch (error) {
      ErrorsLogService.logError('Questions', `query: ${data.formName}, ` + error.toString(), 'questionsByFormName', socket.user.id);
    }
  });
});

module.exports = {
  getQuestionsByFormName: async (req, res) => {
    try {
      let query = req.params.query;
      let questionsObj = await Questions.findOne({
        name: {
          'contains': query
        }
      }).populate('questions');

      res.ok(questionsObj);
    } catch (error) {
      ErrorsLogService.logError('Questions', `query: ${req.params.query}, ` + error.toString(), 'getQuestionsByFormName', req);
      res.ok({
        message: 'Not found.',
        error
      });
    }
  },

};
