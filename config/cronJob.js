const userController = require('../api/controllers/UserController');
const reportsController = require('../api/controllers/ReportsController');

function cronJob(cb) {
  //Synchronize Users
  userController.syncUsers();

  // Email Reminder For Project Order Creation
  userController.emailReminderOrderCreation();
  
  // sent email reminder for project closing report creation
  userController.emailReminderClosingReport();
  
  //send email reminder for those approval which are pending
  userController.emailReminderPendingApprovals();

  //Email Reminder for Status Report Creation
  userController.emailReminderStatusReport();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    userController.syncUsers();

    userController.emailReminderOrderCreation();
    
    userController.emailReminderClosingReport();
    
    userController.emailReminderPendingApprovals();
    
    userController.emailReminderStatusReport();
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
