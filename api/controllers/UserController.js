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
        }).catch(error => {
          res.badRequest(error);
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
    }).catch(error => {
    })
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

  notifyAdminsbyEmailAttachment: async (req, res) => {
    req.file('attachment').upload({
      dirname: '../../../uploads/'
    }, async (err, uploadedFiles) => {
      if (err) {
        console.log(err);
        return res.send(500, err);
      }

      if (uploadedFiles.length > 0) {
        if (uploadedFiles[0].fd.includes("..")) {
          while (uploadedFiles[0].fd.includes("..")) {
            uploadedFiles[0].fd = uploadedFiles[0].fd.replace(`..\\`, ``);
          }
        }
      }

      let attachmentObj = {
        fileName: uploadedFiles[0].filename,
        path: uploadedFiles[0].fd
      };

      res.ok(attachmentObj);
    });
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

  emailReminderOrderCreation: async (req, res) => {
    try {
      const moment = require('moment');

      let projects = await Projects.find({
        outlineApproved: true,
        orderSubmitted: false
      }).populateAll();

      if (projects.length > 0) {
        let emailConfig = await EmailConfig.findOne({
          event: 'Email Reminder Project Order'
        });

        projects.forEach(async (project, index) => {
          let dateDiffDays = moment(project.projectOutline[0].initiationApprovalDate).diff(moment(new Date()), 'days');
          ++dateDiffDays;

          if (dateDiffDays == 14 || dateDiffDays == 1) {
            if (project.user) {
              EmailService.sendMail({
                email: project.user.email,
                message: emailConfig.text,
                subject: `Reminder oneView Projekt ID ${project.uid}: Projektauftrag fällig`
              }, (err) => {
                if (err) {
                  console.log(err);
                  res.forbidden({
                    message: "Error sending email."
                  });
                } else {
                  if (index == projects.length - 1) {
                    console.log('Project Order Reminder Emails Sent.');
                    res.send({
                      message: "Project Order Reminder Emails Sent."
                    });
                  }
                }
              })
            }
          }
        });
      }
    } catch (error) {
    }
  },

  emailReminderClosingReport: async (req, res) => {
    try {
      const moment = require('moment');

      let orderApprovedProjects = await Projects.find({
        orderApproved: true
      }).populateAll();
      let detailIds = [];
      let projects = [];

      orderApprovedProjects.forEach(project => {
        if (project.projectReport) {
          detailIds.push(project.projectReport.id);
          projects.push(project);
        }
      });

      let details = await Reports.find({
        id: {
          $in: detailIds
        }
      }).populateAll();

      if (details.length > 0) {
        let emailConfig = await EmailConfig.findOne({
          event: 'Email Reminder Closing Report'
        });

        details.forEach(async (detail, index) => {
          if (detail.statusReports.length > 0 && detail.status != 'Closed') {
            if (projects[index].docType == 'Closing Report' && (projects[index].status == 'Submitted' || projects[index].status == 'Approved' || projects[index].status == 'On Hold')) {
              // those whose do not send email reminder
            } else {
              // those whose send email reminder
              let dateDiffDays = moment(detail.forecastEndDate).diff(moment(new Date()), 'days');
              if (dateDiffDays <= 14 && ((dateDiffDays % 7) == 0)) {
                if (projects[index].user) {
                  EmailService.sendMail({
                    email: projects[index].user.email,
                    message: emailConfig.text,
                    subject: `Reminder oneView Projekt ID ${projects[index].uid}: Abschlussbericht fällig`
                  }, (err) => {
                    if (err) {
                      console.log(err);
                      if (res != undefined) {
                        res.forbidden({
                          message: "Error sending email."
                        });
                      }
                    } else {
                      if (index == details.length - 1) {
                        console.log('Closing Report Reminder Emails Sent.');
                        if (res != undefined) {
                          res.send({
                            message: "Closing Report Reminder Emails Sent."
                          });
                        }
                      }
                    }
                  })
                }
              }
            }
          }
        });
      }
    } catch (error) {
    }
  },

  emailReminderPendingApprovals: async (req, res) => {
    try {
      let approvals = await OutlineApproval.find({
        status: "Open"
      }).populateAll();

      if (approvals.length > 0) {
        let emailConfig = await EmailConfig.findOne({
          event: 'Email Reminder Pending Approval'
        });
        let date = new Date().getDate();

        approvals.forEach(async (approval, index) => {
          if (date == 10 || date == 20 || date == 28) {
            if (approval.assignedTo) {
              EmailService.sendMail({
                email: approval.assignedTo.email,
                message: emailConfig.text,
                subject: 'Reminder oneView ausstehende Workflows '
              }, (err) => {
                if (err) {
                  console.log(err);
                  res.forbidden({
                    message: "Error sending email."
                  });
                } else {
                  if (index == approvals.length - 1) {
                    console.log('Pending Approvals Reminder Emails Sent.');
                    res.send({
                      message: "Pending Approvals Reminder Emails Sent."
                    });
                  }
                }
              })
            }
          }
        });
      }
    } catch (error) {
    }
  },

  emailReminderStatusReport: async (req, res) => {
    try {
      const moment = require('moment');

      let orderApprovedProjects = await Projects.find({
        orderApproved: true
      }).populateAll();
      let detailIds = [];
      let projects = [];

      orderApprovedProjects.forEach(project => {
        if (project.projectReport) {
          detailIds.push(project.projectReport.id);
          projects.push(project);
        }
      });

      let details = await Reports.find({
        id: {
          $in: detailIds
        }
      }).populateAll();

      if (details.length > 0) {
        let emailConfig = await EmailConfig.findOne({
          event: 'Email Reminder Status Report'
        });

        details.forEach(async (detail, index) => {
          if (projects[index].subPortfolio) {
            if (projects[index].subPortfolio.statusReportReminder && Array.isArray(projects[index].subPortfolio.statusReportReminder) &&
              detail.status == 'Active') {
              let dateDiffDays;
              let isCurrentDate;

              projects[index].subPortfolio.statusReportReminder.forEach(reminderDate => {
                if ((new Date().getDate() == new Date(reminderDate).getDate()) &&
                  (new Date().getMonth() + 1 == new Date(reminderDate).getMonth() + 1)) {
                  isCurrentDate = true;
                  return;
                }
              });

              if (isCurrentDate) {
                if (detail.statusReports.length > 0) {
                  if ((detail.statusReports.length > 1 && detail.statusReports[detail.statusReports.length - 2].status == 'Submitted')) {
                    dateDiffDays = moment(new Date()).diff(moment(detail.statusReports[detail.statusReports.length - 2].submittedDate), 'days');
                  } else if (detail.statusReports[detail.statusReports.length - 1].status == 'Submitted') {
                    dateDiffDays = moment(new Date()).diff(moment(detail.statusReports[detail.statusReports.length - 1].submittedDate), 'days');
                  }
                }

                if (dateDiffDays == undefined || dateDiffDays >= 7) {
                  if (projects[index].user) {
                    EmailService.sendMail({
                      email: projects[index].user.email,
                      message: emailConfig.text,
                      subject: `Reminder oneView Projekt ID ${projects[index].uid}: Statusbericht fällig`
                    }, (err) => {
                      if (err) {
                        console.log(err);
                        res.forbidden({
                          message: "Error sending email."
                        });
                      } else {
                        if (index == details.length - 1) {
                          console.log('Status Report Reminder Emails Sent.');
                          res.send({
                            message: "Status Report Reminder Emails Sent."
                          });
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
    }
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
