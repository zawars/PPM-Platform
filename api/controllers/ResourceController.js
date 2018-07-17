/**
 * ResourceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  resourceByReport: (req, res) => {
    Resource.findOne({
      report: req.params.id
    }).then(resource => {
      res.ok(resource);
    }).catch(err => {
      res.badRequest(err);
    });
  },

};
