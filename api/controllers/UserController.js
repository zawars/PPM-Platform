/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const request = require('request');
const async = require('async');
const fs = require('fs');

module.exports = {
  getUsersFromRoles: (req, res) => {
    User.find({
      role: req.params.role
    }).then(users => {
      res.ok(users);
    }).catch(error => {
      re.badRequest(error);
    })
  },

  getUserByEmail: (req, res) => {
    User.findOne({
      email: req.params.email
    }).then(user => {
      res.ok(user);
    });
  },

  sendEmail: (req, res) => {
    EmailService.sendMail({
      email: req.body.email,
      message: req.body.message,
      subject: req.body.subject
    }, (err) => {
      if (err) {
        console.log(err);
        res.forbidden({
          message: "Error sending email."
        });
      } else {
        res.send({
          message: "Email sent."
        });
      }
    })
  },

  login: (req, res) => {
    res.redirect('/');
  },

  syncUsers: (req, res) => {
    syncUsers(res);
  }
};

let syncUsers = async (res) => {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

  var options = {
    method: 'POST',
    url: config.url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      resource: 'https://graph.microsoft.com',
      grant_type: 'password',
      username: config.adminEmail,
      password: config.adminPassword,
      scope: 'openid'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      sails.log.error(error);
    }

    let options1 = {
      method: 'GET',
      url: 'https://graph.microsoft.com/v1.0/users',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(response.body).access_token
      }
    };

    request(options1, async (error1, response1, body1) => {
      if (error) sails.log.error('error1')

      // updation and creation of users
      let usersList = JSON.parse(body1).value; //List returned from AD.
      let localUsersList = await User.find(); // Local Users list

      //loop for update or create user
      for (let item of usersList) {
        try {
          let user = localUsersList.filter(val => val.azureId == item.id);

          if (user.length > 0) {
            if (user[0].email != item.userPrincipalName || user[0].name != item.givenName) {
              user[0].azureId = item.id;
              user[0].email = item.userPrincipalName;
              user[0].name = item.givenName;

              await user[0].save();
            }
          } else {
            await User.create({
              azureId: item.id,
              email: item.userPrincipalName,
              name: item.givenName,
              role: 'guest'
            });
          }

        } catch (error) {
          sails.log.error(error);
        }
      }

      sails.log.info(`Synced azure users ${body1}`);

      User.find().then(async updatedUsersList => {

        // Synchronize Deleted Users in AD.
        let ADUsersSet = getEmailSetfromADCollection(new Set(usersList));
        let updatedUsersSet = getEmailSetfromMongoCollection(new Set(updatedUsersList));
        let deletedUsersSet = difference(updatedUsersSet, ADUsersSet);

        if (deletedUsersSet.size > 0) {
          for (let obj of deletedUsersSet) {
            await User.destroy({ azureId: obj });
            sails.log.info('User Deleted.');
          }
        }
        if (res != undefined) {
          res.ok({ message: "Synchronized." })
        }
      })
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
    set.add(user.azureId);
  });
  return set;
}

let getEmailSetfromADCollection = (userList) => {
  let set = new Set();
  userList.forEach(user => {
    set.add(user.id);
  });
  return set;
}
