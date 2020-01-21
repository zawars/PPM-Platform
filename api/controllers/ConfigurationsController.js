/**
 * ConfigurationController
 *
 * @description :: Server-side logic for managing Configuration
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getGlobalConfigurations: (req, res) => {
    Configurations.findOne({ uid: 1 }).then(response => {
      res.ok(response);
    }).catch(error => {
      ErrorsLogService.logError('Configuration', error.toString(), 'getGlobalConfigurations', req);
      res.forbidden(error);
    });
  },

  getConfigurationsByUser: (req, res) => {
    Configurations.findOne({ user: req.params.id }).then(response => {
      res.ok(response);
    }).catch(error => {
      ErrorsLogService.logError('Configuration', error.toString(), 'getConfigurationsByUser', req);
      res.badRequest(error);
    });
  }
};

