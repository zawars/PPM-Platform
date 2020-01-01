/**
 * RightsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    projectRights: async (req, res) => {
        try {
            const right = await Rights.findOne({ project: req.params.projectId, user: req.params.userId}).populateAll();
            res.ok(right);
        } catch (e) {
            res.badRequest(e);
        }
    },

};

