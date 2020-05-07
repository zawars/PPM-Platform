/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const fs = require('fs');

module.exports = {
  fetchLanguage: (req, res) => {
    let locale = req.params.id;
    try {
      let file = fs.readFileSync('assets/langs/' + locale + '.json', 'utf8')
      res.ok(file);
    } catch (error) {
      ErrorsLogService.logError('Notifications', error.toString(), 'fetchLanguage', req);
    }
  }
};
