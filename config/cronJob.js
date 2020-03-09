const userController = require('../api/controllers/UserController');
const reportsController = require('../api/controllers/ReportsController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();
  }, intervalTimer);

  // Excel Export
  reportsController.uploadExcelDumpToDrive();

  setInterval(() => {
    reportsController.uploadExcelDumpToDrive();
  }, intervalTimer / 5);
};

module.exports = {
  cronJob,
}
