const userController = require('../api/controllers/UserController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  //Email Reminder for Status Report Creation
  userController.emailReminderStatusReport();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderStatusReport();
  }, intervalTimer);
};

module.exports = {
  cronJob,
}
