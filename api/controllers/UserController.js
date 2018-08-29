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

    request(options1, function (error1, response1, body1) {
      if (error) {
        sails.log.error('error1');
      }



      //Synchronize New Users from Active Directory
      // let usersList = JSON.parse(body1).value; //List returned from AD.
      // let ADUsersSet = getEmailSetfromADCollection(new Set(usersList));

      // User.find().then(async users => {
      //   let existingUsersSet = getEmailSetfromMongoCollection(new Set(users));

      //   let newUsersSet = difference(ADUsersSet, existingUsersSet);
      //   if (newUsersSet.size > 0) {
      //     for (let item of newUsersSet) {
      //       let obj = usersList.filter(val => val.userPrincipalName == item)[0];
      //       await User.create({
      //         email: item,
      //         role: 'guest',
      //         name: obj.displayName
      //       });
      //       sails.log.info('User Created.');
      //     }
      //   }

      //   // Synchronize Deleted Users in AD.
      //   let updatedUsersList = await User.find();
      //   let updatedUsersSet = getEmailSetfromMongoCollection(new Set(updatedUsersList));
      //   let deletedUsersSet = difference(updatedUsersSet, ADUsersSet);

      //   if (deletedUsersSet.size > 0) {
      //     for (let obj of deletedUsersSet) {
      //       await User.destroy({
      //         email: obj
      //       });
      //       sails.log.info('User Deleted.');
      //     }
      //   }

      //   res.ok({
      //     message: "Synchronized."
      //   })

      // });



      // new code 
      let usersList = JSON.parse(body1).value; //List returned from AD.
      //loop for update or create user
      usersList.forEach(function (i) {

        User.findOne({ $or: [{ azureId: i.id }, { email: i.userPrincipalName }] }).then(async user => {

          if (user) {
            //update
            user.azureId = i.id;
            user.email = i.userPrincipalName;
            user.name = i.givenName;
            user.role = i.displayName;
            user.save((err) => {
              if (err) sails.log.error(error);

              sails.log.info('User updated');
            })
          } else {
            //create
            User.create({
              azureId: i.id,
              email: i.userPrincipalName,
              name: i.givenName,
              role: i.displayName
            }, (err, user) => {
              if (err) sails.log.error(error);

              sails.log.info('User created');
            })
          }
        })
      })
      // for delete user if extra in local db
      // Synchronize Deleted Users in AD.

      User.find().then(async updatedUsersList => {

        // Synchronize Deleted Users in AD.
        let ADUsersSet = getEmailSetfromADCollection(new Set(usersList));
        let updatedUsersSet = getEmailSetfromMongoCollection(new Set(updatedUsersList));
        let deletedUsersSet = difference(updatedUsersSet, ADUsersSet);

        if (deletedUsersSet.size > 0) {
          for (let obj of deletedUsersSet) {
            await User.destroy({
              azureId: obj
            });
            sails.log.info('User Deleted.');
          }
        }

        res.ok({ message: "Synchronized." })
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
