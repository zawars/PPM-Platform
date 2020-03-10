const userController = require('../api/controllers/UserController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  // sent email reminder for project closing report creation
  userController.emailReminderClosingReport();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderClosingReport();
  }, intervalTimer);
};

module.exports = {
  cronJob,
}
