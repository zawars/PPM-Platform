/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;
var Email = require('machinepack-email');


io.on('connection', socket => {

  socket.on('getSelectiveProjects', data => {
    let projectsIds = data.ids;
    Projects.find({
      id: projectsIds
    }).then(projects => {
      socket.emit('getSelectiveProjects', projects);
    }).catch(err => {
    })
  });

  socket.on('getAllProjects', data => {
    Projects.find()
      .populateAll().then(projects => {
        socket.emit('getAllProjects', projects);
      }).catch(err => {
      })
  });

  socket.on('activeProjectsCount', async data => {
    try {
      let count = await Projects.count({
        isClosed: false
      });
      socket.emit('activeProjectsCount', count);
    } catch (error) {
    }
  });

  socket.on('getRecentActiveProjects', async data => {
    let search = data.search;
    try {
      let projectsList = await Projects.find({
        isClosed: false,
        projectName: {
          startsWith: search
        }
      }).limit(10).sort('projectName');
      socket.emit('getRecentActiveProjects', projectsList);
    } catch (error) {
    }
  });

  socket.on('activeProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({
        isClosed: false
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('activeProjectsIndex', projectsList);
    } catch (error) {
    }
  });


  socket.on('resetProjectsCount', async data => {
    try {
      let count = await Projects.count({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false, status: 'Submitted' },
          { docType: 'Order', orderSubmitted: true, orderApproved: false, status: 'Submitted' },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false, status: 'Submitted' },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      });
      socket.emit('resetProjectsCount', count);
    } catch (error) {
    }
  });

  socket.on('resetProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false, status: 'Submitted' },
          { docType: 'Order', orderSubmitted: true, orderApproved: false, status: 'Submitted' },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false, status: 'Submitted' },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('resetProjectsIndex', projectsList);
    } catch (error) {
    }
  });


  socket.on('resetProjectsCount', async data => {
    try {
      let count = await Projects.count({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false },
          { docType: 'Order', orderSubmitted: true, orderApproved: false },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      });
      socket.emit('resetProjectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'resetProjectsCount', '', socket.user.id);
    }
  });

  socket.on('resetProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false },
          { docType: 'Order', orderSubmitted: true, orderApproved: false },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('resetProjectsIndex', projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'resetProjectsIndex', '', socket.user.id);
    }
  });

  socket.on('closedProjectsCount', async data => {
    try {
      let count = await Projects.count({
        isClosed: true
      });
      socket.emit('closedProjectsCount', count);
    } catch (error) {
    }
  });

  socket.on('closedProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({
        isClosed: true
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();

      socket.emit('closedProjectsIndex', projectsList);
    } catch (error) {
    }
  });

  socket.on('activeProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [{
        projectName: {
          contains: search
        },
        isClosed: false
      },
      {
        docType: {
          contains: search
        },
        isClosed: false
      }
      ]
    });

    Projects.find({
      or: [{
        projectName: {
          contains: search
        },
        isClosed: false
      },
      {
        docType: {
          contains: search
        },
        isClosed: false
      }
      ]
    }).limit(10).sort('createdAt', 'DESC').populateAll().then(projects => {
      socket.emit('activeProjectsSearch', {
        count,
        projects
      });
    }).catch(error => {
    })
  });

  socket.on('activeProjectsSearchIndex', async data => {
    try {
      let search = data.search;
      let projectsList = await Projects.find({
        or: [{
          projectName: {
            contains: search
          },
          isClosed: false
        },
        {
          docType: {
            contains: search
          },
          isClosed: false
        }
        ]
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('activeProjectsSearchIndex', projectsList);
    } catch (error) {
    }
  });

  socket.on('closedProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [{
        uid: parseInt(search),
        isClosed: true
      },
      {
        projectName: {
          contains: search
        },
        isClosed: true
      },
      {
        status: {
          contains: search
        },
        isClosed: true
      },
      {
        docType: {
          contains: search
        },
        isClosed: true
      }
      ]
    });

    Projects.find({
      or: [{
        uid: parseInt(search),
        isClosed: true
      },
      {
        projectName: {
          contains: search
        },
        isClosed: true
      },
      {
        status: {
          contains: search
        },
        isClosed: true
      },
      {
        docType: {
          contains: search
        },
        isClosed: true
      }
      ]
    }).limit(10).sort('createdAt', 'DESC').populateAll().then(projects => {
      socket.emit('closedProjectsSearch', {
        count,
        projects
      });
    }).catch(error => {
    })
  });

  socket.on('closedProjectsSearchIndex', async data => {
    try {
      let search = data.search;
      let projectsList = await Projects.find({
        or: [{
          uid: parseInt(search),
          isClosed: true
        },
        {
          projectName: {
            contains: search
          },
          isClosed: true
        },
        {
          status: {
            contains: search
          },
          isClosed: true
        },
        {
          docType: {
            contains: search
          },
          isClosed: true
        }
        ]
      })
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .sort('createdAt', 'DESC').populateAll();

      socket.emit('closedProjectsSearchIndex', projectsList);
    } catch (error) {
    }
  });

  socket.on('submittedProjectsIndex', data => {
    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
        status: {
          not: 'Rejected'
        }
      },
      {
        orderSubmitted: true,
        orderApproved: false,
        status: {
          not: 'Rejected'
        }
      },
      {
        status: 'Draft'
      }
      ]
    }).paginate({
      page: data.pageIndex,
      limit: data.pageSize
    })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('submittedProjectsIndex', projects);
      }).catch(error => {
      });
  });

  socket.on('submittedProjectsCount', async data => {
    try {
      let count = await Projects.count({
        or: [{
          outlineSubmitted: true,
          outlineApproved: false,
          status: {
            not: 'Rejected'
          }
        },
        {
          orderSubmitted: true,
          orderApproved: false,
          status: {
            not: 'Rejected'
          }
        },
        {
          status: 'Draft'
        }
        ]
      });
      socket.emit('submittedProjectsCount', count);
    } catch (error) {
    }
  });

  socket.on('submittedProjectsSearchIndex', data => {
    let search = data.search;

    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
        status: {
          not: 'Rejected'
        }
      },
      {
        orderSubmitted: true,
        orderApproved: false,
        status: {
          not: 'Rejected'
        }
      }
      ],
      or: [{
        uid: parseInt(search)
      },
      {
        docType: {
          contains: search
        }
      },
      {
        status: {
          contains: search
        }
      },
      {
        projectName: {
          contains: search
        }
      }
      ]
    }).paginate({
      page: data.pageIndex,
      limit: data.pageSize
    })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('submittedProjectsSearchIndex', projects);
      }).catch(error => {
      });
  });

  socket.on('submittedProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
        status: {
          not: 'Rejected'
        }
      },
      {
        orderSubmitted: true,
        orderApproved: false,
        status: {
          not: 'Rejected'
        }
      }
      ],
      or: [{
        uid: parseInt(search)
      },
      {
        docType: {
          contains: search
        }
      },
      {
        status: {
          contains: search
        }
      },
      {
        projectName: {
          contains: search
        }
      }
      ]
    });

    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
        status: {
          not: 'Rejected'
        }
      },
      {
        orderSubmitted: true,
        orderApproved: false,
        status: {
          not: 'Rejected'
        }
      }
      ],
      or: [{
        uid: parseInt(search)
      },
      {
        docType: {
          contains: search
        }
      },
      {
        status: {
          contains: search
        }
      },
      {
        projectName: {
          contains: search
        }
      }
      ]
    }).populateAll().sort('createdAt DESC').then(projects => {
      socket.emit('submittedProjectsSearch', {
        count,
        projects
      });
    }).catch(error => {
    });
  });

  socket.on('projectsIndex', data => {
    Projects.find({
      user: data.userId
    })
      .paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().sort('uid DESC').then(projects => {
        socket.emit('projectsIndex', projects);
      }).catch(error => {
      });
  });

  socket.on('projectsCount', async data => {
    try {
      let count = await Projects.count({
        user: data.userId
      });
      socket.emit('projectsCount', count);
    } catch (error) {
    }
  });

  //To search in data table of Projects
  socket.on('projectsSearch', async data => {
    let search = data.search;
    try {
      let count = await Projects.count({
        user: data.userId,
        or: [{
          uid: parseInt(search)
        },
        {
          docType: {
            contains: search
          }
        },
        {
          status: {
            contains: search
          }
        },
        {
          projectName: {
            contains: search
          }
        }
        ]
      });

      Projects.find({
        user: data.userId,
        or: [{
          uid: parseInt(search)
        },
        {
          docType: {
            contains: search
          }
        },
        {
          status: {
            contains: search
          }
        },
        {
          projectName: {
            contains: search
          }
        }
        ]
      }).limit(10).populateAll().sort('uid DESC').then(projects => {
        socket.emit('projectsSearch', {
          count: count,
          projects: projects
        });
      });
    } catch (error) {
    }
  });

  //To paginate search results of projects
  socket.on('projectsSearchIndex', data => {
    let search = data.search;
    Projects.find({
      user: data.userId,
      or: [{
        uid: parseInt(search)
      },
      {
        docType: {
          contains: search
        }
      },
      {
        status: {
          contains: search
        }
      },
      {
        projectName: {
          contains: search
        }
      }
      ]
    }).paginate({
      page: data.pageIndex,
      limit: data.pageSize
    }).populateAll().sort('uid DESC').then(projects => {
      socket.emit('projectsSearchIndex', projects);
    }).catch(error => {
    })
  });

  // To send email
  socket.on('sendEmail', data => {
    EmailService.sendMail({
      email: data.email,
      message: data.message,
      subject: data.subject
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
        socket.emit('sendEmail', {
          message: "Email sent."
        });
      }
    });
  });

  socket.on('fetchMultipleUsers', async data => {
    let users = await User.find({
      id: {
        $in: data.userIds
      }
    });
    socket.emit('fetchMultipleUsers', users);
  });

  socket.on('searchOpenDetailsProjects', async data => {
    let query = data.search;

    let projects = await Projects.find({
      or: [{
        projectName: {
          'contains': query
        }
      },
      {
        uid: parseInt(query)
      }
      ],
      outlineApproved: true
    }, {
      fields: {
        uid: 1,
        projectName: 1
      }
    }).limit(10).sort('uid DESC');

    socket.emit('searchOpenDetailsProjects', projects);
  });

  // notify Admins by Email for report an issue
  socket.on('notifyAdminsbyEmail', async data => {
    let user = data.user;
    let message = data.message;
    let attachments = data.attachments;

    if (attachments && attachments.length > 0) {
      attachments[0].path = process.cwd().split('\\' + process.cwd().split('\\').pop())[0] + '\\' + attachments[0].path;
    }

    let admins = await User.find({
      role: 'admin'
    });

    let recepientsEmails = [];

    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        recepientsEmails.push(admin.email);
      })

      EmailService.sendMail({
        email: recepientsEmails,
        message: message,
        subject: user.name + ` (${user.email}) Reported an Issue`,
        attachments: attachments
      }, (err) => {
        if (err) {
          console.log(err);
          res.forbidden({
            message: "Error sending email."
          });
        } else {
          socket.emit('notifyAdminsbyEmail', {
            message: "Email sent."
          });
        }
      })
    } else {
      socket.emit('notifyAdminsbyEmail', {
        message: "No Admins found."
      });
    }
  });
});

module.exports = {
  userProjects: (req, res) => {
    Projects.find({
      user: req.params.id
    }).limit(req.param('limit') || 10).populateAll().sort('uid DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
    });
  },

  getOutlineApprovedProjects: (req, res) => {
    Projects.find({
      user: req.params.id,
      outlineApproved: true
    }).sort('createdAt DESC').limit(10).then(projects => {
      res.ok(projects);
    }).catch(error => {
      res.badRequest(error);
    });
  },

  getSubmittedProjects: (req, res) => {
    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }
      ],
      status: 'Submitted'
    }).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      res.badRequest(error);
    });
  },

  getUserReport: async (req, res) => { // Team Project/Reports
    try {
      let n = 0;
      let projects = await Projects.find({
        isCashedOut: false,
      }).populateAll();
      let userArr = new Set();
      projects.forEach(async project => {
        userArr.add(project.projectOutline[0].projectManager.id);
        userArr.add(project.projectOutline[0].pmoOfficer.id);
        userArr.add(project.projectOutline[0].projectSponsor.id);

        if (project.projectOrder.length > 0) {
          userArr.add(project.projectOrder[0].projectManager.id);
          userArr.add(project.projectOrder[0].pmoOfficer.id);
          userArr.add(project.projectOrder[0].projectSponsor.id);
          userArr.add(project.projectOrder[0].projectFico.id);
        }

        if (project.changeRequests.length > 0) {
          userArr.add(project.changeRequests[0].projectFico.id);
        }

        if (project.closingReport.length > 0) {
          userArr.add(project.closingReport[0].projectFico.id);
        }

        let report = await Reports.findOne({
          id: project.projectReport
        }).populateAll();

        if (report.team) {
          let team = report.team;
          team.forEach(member => {
            userArr.add(member.name.id);
          });
        }

        let usersList = [];

        userArr.forEach(val => {
          User.findOne({
            id: val
          }).then(userObj => {
            usersList.push(userObj);
            n++;

            if (n == userArr.size) {
              res.ok(usersList);
            }
          });
        });
      });
    } catch (error) {
      res.badRequest(error);
    }
  },

  resetCount: (req, res) => {
    Projects.update({
      isClosed: true,
      isCashedOut: false
    }, {
      isCashedOut: true
    }).then(projects => {
      res.ok(projects);
    }).catch(err => {
      res.badRequest(err);
    });
  },

  submitOutline: (req, res) => {
    let body = req.body;
    Projects.create(body).then(projectResponse => {
      Projects.findOne({
        id: projectResponse.id
      }).populate('projectOutline').then(async project => {
        let projectOutline = await ProjectOutline.findOne({
          id: project.projectOutline[0].id
        }).populateAll();

        let temp = {
          projectOutline: projectOutline,
          status: "Open",
          overallStatus: "Submitted",
          projectStatus: 'Submitted',
          assignedTo: body.projectOutline.pmoOfficer.id,
          project: projectResponse.id,
          docType: "Outline",
          sentTo: "PMO",
          isFreezed: false,
          version: body.projectOutline.version,
          uid: project.uid
        };

        OutlineApproval.create(temp).then(response => {
          res.ok({
            approvalId: response.id
          });
        }).catch(error => {
        })
      }).catch(error => {
      })
    }).catch(error => {
      })
  },

  submitOutlineUpdateCase: async (req, res) => {
    let body = req.body;
    let outline = JSON.parse(JSON.stringify(body.projectOutline));
    let backup = JSON.parse(JSON.stringify(body.projectOutline));
    delete (body.projectOutline);

    Projects.update({
      id: req.params.id
    }, body).then(projectResponse => {
      ProjectOutline.update({
        id: outline.id
      }, outline).then(outlineObj => {
        ProjectOutline.findOne({
          id: outline.id
        }).populate('projectId').then(async populatedObj => {
          backup.projectId = populatedObj.projectId;
          backup.createdAt = populatedObj.createdAt;

          let projectOutline = await ProjectOutline.findOne({
            id: outline.id
          }).populateAll();

          OutlineApproval.create({
            projectOutline: projectOutline,
            status: "Open",
            projectStatus: 'Submitted',
            overallStatus: "Submitted",
            assignedTo: outline.pmoOfficer.id,
            project: projectResponse[0].id,
            docType: "Outline",
            sentTo: "PMO",
            isFreezed: false,
            version: outline.version,
            uid: projectResponse[0].uid
          }).then(response => {
            res.ok({
              approvalId: response.id
            });
          });
        }).catch(error => {
        })
      }).catch(error => {
      })
    }).catch(error => {
    })
  },

  getRecentActiveProjects: async (req, res) => {
    try {
      let limit = 0;
      if (req.param('limit')) {
        limit = req.param('limit');
      }
      let projectsList = await Projects.find({
        isClosed: false
      }).limit(limit).populateAll();

      res.ok(projectsList);
    } catch (error) {
    }
  },

  getResetProjects: async (req, res) => {
    try {
      let limit = 0;
      if (req.param('limit')) {
        limit = req.param('limit');
      }
      let projectsList = await Projects.find({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false, status: 'Submitted' },
          { docType: 'Order', orderSubmitted: true, orderApproved: false, status: 'Submitted' },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false, status: 'Submitted' },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      }).limit(limit).populateAll();

      res.ok(projectsList);
    } catch (error) {
    }
  },

  getResetProjects: async (req, res) => {
    try {
      let limit = 0;
      if (req.param('limit')) {
        limit = req.param('limit');
      }
      let projectsList = await Projects.find({
        or: [
          { docType: 'Outline', outlineSubmitted: true, outlineApproved: false },
          { docType: 'Order', orderSubmitted: true, orderApproved: false },
          { docType: 'Change Request', changeRequestMade: true, changeRequestApproved: false },
          { docType: 'Closing Report', closingReportSubmitted: true, closingReportApproved: false, status: 'Submitted' }
        ]
      }).limit(limit).populateAll();

      res.ok(projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'getResetProjects', req);
    }
  },

  getClosedProjects: async (req, res) => {
    try {
      let limit = 0;
      if (req.param('limit')) {
        limit = req.param('limit');
      }
      let projects = await Projects.find({
        isClosed: true
      }).limit(limit).populateAll();

      res.ok(projects);
    } catch (error) {
    }
  },

  activeProjectsSearch: async (req, res) => {
    let search = req.params.search;
    try {
      let projectsList = await Projects.find({
        isClosed: false,
        projectName: {
          startsWith: search
        }
      }).limit(10).sort('projectName');
      res.ok(projectsList);
    } catch (error) {
    }
  },

  search: async (req, res) => {
    let query = req.params.query;

    try {
      let projects = await Projects.find({
        or: [{
          projectName: {
            'contains': query
          }
        },
        {
          uid: parseInt(query)
        }
        ]
      }, {
        fields: {
          uid: 1,
          projectName: 1
        }
      }).where({ mode: { '!': 'bucket' } }).limit(10).sort('uid DESC');

      res.send(projects);

    } catch (error) {
      res.badRequest(error);
    }
  }

};
