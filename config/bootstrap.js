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

module.exports.bootstrap = async function (cb) {

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

  if (await SmallOrder.count() > 0) {
    let smallOrders = await SmallOrder.find();
    let uidStr = smallOrders[smallOrders.length - 1].uid;
    let uid = uidStr.match(/\d/g)
    uid = uid.join("");
    EmailService.smallOrderCounter = uid;
  }

  let emailConfigEvents = ['Email Reminder Project Order', 'Email Reminder Pending Approval', 'Email Reminder Status Report', 'Email Reminder Closing Report', 'Small Order Started', 'Small Order Closed'];

  emailConfigEvents.forEach(async event => {
    let emailConfig = await EmailConfig.findOne({
      event: event
    });
    if (!emailConfig) {
      await EmailConfig.create({
        event: event,
        text: ""
      });
    }
  });

  // script to change itPlatform to array of ids of Project Outline
  let outlines = await ProjectOutline.find().populateAll();
  outlines.forEach(async outline => {
    if (outline.itPlatform) {
      if (outline.itPlatform.id) {
        await ProjectOutline.update({
          id: outline.id
        }).set({
          itPlatform: [outline.itPlatform.id]
        });
      }
    }
  });

  // script to change itPlatform to array of ids of Project Order
  let orders = await ProjectOrder.find().populateAll();
  orders.forEach(async order => {
    if (order.itPlatform) {
      if (order.itPlatform.id) {
        await ProjectOrder.update({
          id: order.id
        }).set({
          itPlatform: [order.itPlatform.id]
        });
      }
    }
  });

  // script to change itPlatform to array of ids of Project Closing Report
  let changeRequests = await ChangeRequest.find().populateAll();
  changeRequests.forEach(async changeRequest => {
    if (changeRequest.itPlatform) {
      if (changeRequest.itPlatform.id) {
        await ChangeRequest.update({
          id: changeRequest.id
        }).set({
          itPlatform: [changeRequest.itPlatform.id]
        });
      }
    }
  });

  // script to change itPlatform to array of ids of Project Details
  let details = await Reports.find().populateAll();
  details.forEach(async detail => {
    if (detail.itPlatform) {
      if (!detail.itPlatform.length) {
        if (detail.itPlatform.id) {
          await Reports.update({
            id: detail.id
          }).set({
            itPlatform: [detail.itPlatform.id]
          });
        } else {
          await Reports.update({
            id: detail.id
          }).set({
            itPlatform: [detail.itPlatform]
          });
        }
      }
    }
  });

  cronJob();

  //Run Server on HTTPS
  // if (sails.config.environment === "production") {
  //   http.createServer(sails.hooks.http.app).listen(81);
  // }

  cb();
};
