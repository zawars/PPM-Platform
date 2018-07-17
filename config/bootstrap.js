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
// const HTTP = require('machinepack-http');
var request = require('request');
let async = require('async');

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


  //Synchronize Users
  syncUsers();

  //Synchronize Users Cycle after every 24 Hours
  let intervalTimer = 1000 * 60 * 60 * 24;
  setInterval(() => {
    syncUsers();
  }, intervalTimer);

  //Run Server on HTTPS
  if (sails.config.environment === "production") {
    http.createServer(sails.hooks.http.app).listen(81);
  }

  cb();
};

let syncUsers = async () => {
  var options = {
    method: 'POST',
    url: 'https://login.microsoftonline.com/luftmatrazetoutlook.onmicrosoft.com/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      client_id: '42b8cc8e-5a2b-4455-828b-3a8f59aed428',
      client_secret: 'Q4YvrZxZgynFcUHwbRSRIQnEMx9HHpE+H+6bYx2m6lI=',
      resource: 'https://graph.microsoft.com',
      grant_type: 'password',
      username: 'admin@luftmatrazetoutlook.onmicrosoft.com',
      password: 'kitcHlew2233$',
      scope: 'openid'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      throw new Error(error);
    }

    let options1 = {
      method: 'GET',
      url: 'https://graph.microsoft.com/v1.0/users',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(response.body).access_token
      }
    };

    request(options1, function (error1, response1, body1) {
      if (error) {
        throw new Error(error1);
      }

      //Synchronize New Users from Active Directory
      let usersList = JSON.parse(body1).value; //List returned from AD.
      let ADUsersSet = getEmailSetfromADCollection(new Set(usersList));

      User.find().then(async users => {
        let existingUsersSet = getEmailSetfromMongoCollection(new Set(users));

        let newUsersSet = difference(ADUsersSet, existingUsersSet);
        if (newUsersSet.size > 0) {
          for (let item of newUsersSet) {
            let obj = usersList.filter(val => val.userPrincipalName == item)[0];
            await User.create({
              email: item,
              role: 'guest',
              name: obj.displayName
            });
            sails.log.info('User Created.');
          }
        }

        // Synchronize Deleted Users in AD.
        let updatedUsersList = await User.find();
        let updatedUsersSet = getEmailSetfromMongoCollection(new Set(updatedUsersList));
        let deletedUsersSet = difference(updatedUsersSet, ADUsersSet);

        if (deletedUsersSet.size > 0) {
          for (let obj of deletedUsersSet) {
            await User.destroy({
              email: obj
            });
            sails.log.info('User Deleted.');
          }
        }

      });
    });
  });

}

function difference(setA, setB) {
  var _difference = new Set(setA);
  for (var elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

let getEmailSetfromMongoCollection = (userList) => {
  let set = new Set();
  userList.forEach(user => {
    set.add(user.email);
  });
  return set;
}

let getEmailSetfromADCollection = (userList) => {
  let set = new Set();
  userList.forEach(user => {
    set.add(user.userPrincipalName);
  });
  return set;
}