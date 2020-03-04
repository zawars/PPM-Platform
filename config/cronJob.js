const userController = require('../api/controllers/UserController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  // Email Reminder For Project Order Creation
  userController.emailReminderOrderCreation();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderOrderCreation();
  }, intervalTimer);
};

module.exports = {
  cronJob,
}
