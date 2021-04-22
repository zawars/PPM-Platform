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
      res.ok({
        message: 'Not found.',
        error
      });
    }
  },

};
