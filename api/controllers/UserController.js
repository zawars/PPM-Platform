/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const request = require('request');
const fs = require('fs');
const {
  ObjectID
} = require('mongodb');

let usersList = [];

module.exports = {
  getUsersFromRoles: (req, res) => {
    if (req.params.role == "PMO") {
      User.find({
        role: req.params.role,
      }).then(users => {
        User.find({
          role: 'admin',
          isPmoAlso: true
        }).then(adminUsers => {
          res.ok([...users, ...adminUsers]);
        }).catch(err => {
          res.badRequest(err);
        });
      }).catch(error => {
        res.badRequest(error);
      });
    } else {
      User.find({
        role: req.params.role
      }).then(users => {
        res.ok(users);
      }).catch(error => {
        res.badRequest(error);
      });
    }
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
  },

  search: (req, res) => {
    let query = req.params.query;
    User.find({
      or: [{
          name: {
            'contains': query
          }
        },
        {
          email: {
            'contains': query
          }
        }
      ]
    }).then(users => {
      res.ok(users)
    }).catch(err => {
      res.badRequest(err);
    });
  },
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
      grant_type: 'client_credentials',
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      sails.log.error(error);
    }

    if (response) {
      if (response.body) {
        let options1 = {
          method: 'GET',
          url: 'https://graph.microsoft.com/v1.0/users?$select=id,department,mail,displayName,givenName,surname,jobTitle,mobilePhone,officeLocation,preferredLanguage,userPrincipalName',
          headers: {
            Authorization: 'Bearer ' + JSON.parse(response.body).access_token
          }
        };

        // Recursive loop for update or create user
        parseUsers(options1, res, response);
      }
    }
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


let parseUsers = async (options1, res, response) => {
  request(options1, async (error1, response1, body1) => {
    if (error1) sails.log.error(error1)

    // updation and creation of users
    if (body1) {
      usersList.push(...JSON.parse(body1).value); //List returned from AD.
      let localUsersList = await User.find(); // Local Users list
      for (let item of usersList) {
        try {
          let user = localUsersList.filter(val => val.azureId == item.id);

          let flag = false;
          if (user.length > 1) {
            User.native(function (err, collection) {
              if (err) return res.serverError(err);

              for (let obj of user) {
                if (flag == false) {
                  flag = true;
                  continue;
                }

                collection.deleteOne({
                  '_id': new ObjectID(obj.id)
                }, function (err, result) {
                  console.log('Deleted duplicate: ' + obj.email);
                });
              }
            });
          }

          if (user.length > 0) {
            if (user[0].email != item.userPrincipalName || user[0].name != (item.surname + ', ' + item.givenName) || user[0].department != item.department) {
              user[0].azureId = item.id;
              user[0].email = item.userPrincipalName;
              user[0].name = item.surname + ', ' + item.givenName;
              user[0].department = item.department;

              await user[0].save();
            }
          } else {
            await User.create({
              azureId: item.id,
              email: item.userPrincipalName,
              name: item.surname + ', ' + item.givenName,
              department: item.department,
              role: 'guest'
            });
          }

        } catch (error) {
          sails.log.error(error);
        }
      }
    }

    if (body1) {
      if (JSON.parse(body1)["@odata.nextLink"] != undefined) {
        let opts = {
          method: 'GET',
          url: JSON.parse(body1)["@odata.nextLink"],
          headers: {
            Authorization: 'Bearer ' + JSON.parse(response.body).access_token
          }
        };
        parseUsers(opts, res, response);
      } else {
        User.find().then(async updatedUsersList => {

          // Synchronize Deleted Users in AD.
          let ADUsersSet = getEmailSetfromADCollection(new Set(usersList));
          let updatedUsersSet = getEmailSetfromMongoCollection(new Set(updatedUsersList));
          let deletedUsersSet = difference(updatedUsersSet, ADUsersSet);

          if (deletedUsersSet.size > 0) {
            User.native(function (err, collection) {
              if (err) return res.serverError(err);

              for (let obj of deletedUsersSet) {
                collection.deleteOne({
                  'azureId': obj
                }, function (err, result) {
                  sails.log.info('User Deleted.');
                });
              }
            });
          }
          if (res != undefined) {
            usersList = [];
            res.ok({
              message: "Synchronized."
            })
          }
        });
      }
    }
  });
}
