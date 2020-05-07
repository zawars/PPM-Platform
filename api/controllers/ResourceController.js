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
      ErrorsLogService.logError('Resource', `id: ${req.params.id}, ` + err.toString(), 'resourceByReport', req);
      res.badRequest(err);
    });
  },

};
