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
      res.forbidden(error);
    });
  },

  getConfigurationsByUser: (req, res) => {
    Configurations.findOne({ user: req.params.id }).then(response => {
      res.ok(response);
    }).catch(error => {
      res.badRequest(error);
    });
  }
};

