const userController = require('../api/controllers/UserController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();
  }, intervalTimer);
};

module.exports = {
  cronJob,
}
