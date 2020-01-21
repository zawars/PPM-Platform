/**
 * QuestionsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
      ErrorsLogService.logError('Questions', `query: ${req.params.query}, `+ error.toString(), 'getQuestionsByFormName', req);
      res.ok({
        message: 'Not found.',
        error
      });
    }
  },

};
