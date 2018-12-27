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
var http = require('http');
const cronJob = require('./cronJob').cronJob;

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  Projects.find().then(projects => {
    if (projects.length > 0) {
      let uid = projects[projects.length - 1].uid;
      EmailService.counter = uid;
    } else {
      EmailService.counter = 0;
    }
  });

  SubProjects.find().then(projects => {
    if (projects.length > 0) {
      let uid = projects[projects.length - 1].uid;
      EmailService.subProjectCounter = uid;
    } else {
      EmailService.subProjectCounter = 0;
    }
  });

  Program.find().then(projects => {
    if (projects.length > 0) {
      let uid = projects[projects.length - 1].uid;
      EmailService.programCounter = uid;
    } else {
      EmailService.programCounter = 0;
    }
  });

  cronJob();

  //Run Server on HTTPS
  if (sails.config.environment === "production") {
    http.createServer(sails.hooks.http.app).listen(81);
  }

  console.log(process.env);

  cb();
};
