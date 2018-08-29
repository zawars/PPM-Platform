/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

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
    cronJob
}

