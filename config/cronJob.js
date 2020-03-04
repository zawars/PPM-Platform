const userController = require('../api/controllers/UserController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  //send email reminder for those approval which are pending
  userController.emailReminderPendingApprovals();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderPendingApprovals();
  }, intervalTimer);
};

module.exports = {
  cronJob,
}
