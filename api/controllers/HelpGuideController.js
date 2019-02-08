/**
 * HelpGuideController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
      res.ok({
        message: 'Not found.',
        error
      });
    }
  },

};