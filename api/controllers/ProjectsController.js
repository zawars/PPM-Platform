/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;
var Email = require('machinepack-email');


io.on('connection', socket => {

  socket.on('getAllProjects', data => {
    Projects.find()
      .populateAll().then(projects => {
        socket.emit('getAllProjects', projects);
      }).catch(err => {
        ErrorsLogService.logError('Projects', err.toString(), 'getAllProjects', '', socket.user.id);
      })
  });

  socket.on('activeProjectsCount', async data => {
    try {
      let count = await Projects.count({ isClosed: false });
      socket.emit('activeProjectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'activeProjectsCount', '', socket.user.id);
    }
  });

  socket.on('activeProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({ isClosed: false })
        .paginate({ page: data.pageIndex, limit: data.pageSize })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('activeProjectsIndex', projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'activeProjectsIndex', '', socket.user.id);
    }
  });

  socket.on('closedProjectsCount', async data => {
    try {
      let count = await Projects.count({ isClosed: true });
      socket.emit('closedProjectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'closedProjectsCount', '', socket.user.id);
    }
  });

  socket.on('closedProjectsIndex', async data => {
    try {
      let projectsList = await Projects.find({ isClosed: true })
        .paginate({ page: data.pageIndex, limit: data.pageSize })
        .sort('createdAt', 'DESC').populateAll();

      socket.emit('closedProjectsIndex', projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'closedProjectsIndex', '', socket.user.id);
    }
  });

  socket.on('activeProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [
        { projectName: { contains: search }, isClosed: false },
        { docType: { contains: search }, isClosed: false }
      ]
    });

    Projects.find({
      or: [
        { projectName: { contains: search }, isClosed: false },
        { docType: { contains: search }, isClosed: false }
      ]
    }).limit(10).sort('createdAt', 'DESC').populateAll().then(projects => {
      socket.emit('activeProjectsSearch', { count, projects });
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'activeProjectsSearch', '', socket.user.id);
    })
  });

  socket.on('activeProjectsSearchIndex', async data => {
    try {
      let search = data.search;
      let projectsList = await Projects.find({
        or: [
          { projectName: { contains: search }, isClosed: false },
          { docType: { contains: search }, isClosed: false }
        ]
      })
        .paginate({ page: data.pageIndex, limit: data.pageSize })
        .sort('createdAt', 'DESC').populateAll();
      socket.emit('activeProjectsSearchIndex', projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'activeProjectsSearchIndex', '', socket.user.id);
    }
  });

  socket.on('closedProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [
        { uid: parseInt(search), isClosed: true },
        { projectName: { contains: search }, isClosed: true },
        { status: { contains: search }, isClosed: true },
        { docType: { contains: search }, isClosed: true }
      ]
    });

    Projects.find({
      or: [
        { uid: parseInt(search), isClosed: true },
        { projectName: { contains: search }, isClosed: true },
        { status: { contains: search }, isClosed: true },
        { docType: { contains: search }, isClosed: true }
      ]
    }).limit(10).sort('createdAt', 'DESC').populateAll().then(projects => {
      socket.emit('closedProjectsSearch', { count, projects });
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'closedProjectsSearch', '', socket.user.id);
    })
  });

  socket.on('closedProjectsSearchIndex', async data => {
    try {
      let search = data.search;
      let projectsList = await Projects.find({
        or: [
          { uid: parseInt(search), isClosed: true },
          { projectName: { contains: search }, isClosed: true },
          { status: { contains: search }, isClosed: true },
          { docType: { contains: search }, isClosed: true }
        ]
      })
        .paginate({ page: data.pageIndex, limit: data.pageSize })
        .sort('createdAt', 'DESC').populateAll();

      socket.emit('closedProjectsSearchIndex', projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'closedProjectsSearchIndex', '', socket.user.id);
    }
  });

  socket.on('submittedProjectsIndex', data => {
    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }]
    }).paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('submittedProjectsIndex', projects);
      }).catch(error => {
        ErrorsLogService.logError('Projects', error.toString(), 'submittedProjectsIndex', '', socket.user.id);
      });
  });

  socket.on('submittedProjectsCount', async data => {
    try {
      let count = await Projects.count({
        or: [{
          outlineSubmitted: true,
          outlineApproved: false,
        },
        {
          orderSubmitted: true,
          orderApproved: false
        }]
      });
      socket.emit('submittedProjectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'submittedProjectsCount', '', socket.user.id);
    }
  });

  socket.on('submittedProjectsSearchIndex', data => {
    let search = data.search;

    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }],
      or: [
        { uid: parseInt(search) },
        { docType: { contains: search } },
        { status: { contains: search } },
        { projectName: { contains: search } }
      ]
    }).paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('submittedProjectsSearchIndex', projects);
      }).catch(error => {
        ErrorsLogService.logError('Projects', error.toString(), 'submittedProjectsSearchIndex', '', socket.user.id);
      });
  });

  socket.on('submittedProjectsSearch', async data => {
    let search = data.search;
    let count = await Projects.count({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }],
      or: [
        { uid: parseInt(search) },
        { docType: { contains: search } },
        { status: { contains: search } },
        { projectName: { contains: search } }
      ]
    });

    Projects.find({
      or: [{
        outlineSubmitted: true,
        outlineApproved: false,
      },
      {
        orderSubmitted: true,
        orderApproved: false
      }],
      or: [
        { uid: parseInt(search) },
        { docType: { contains: search } },
        { status: { contains: search } },
        { projectName: { contains: search } }
      ]
    }).populateAll().sort('createdAt DESC').then(projects => {
      socket.emit('submittedProjectsSearch', { count, projects });
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'submittedProjectsSearch', '', socket.user.id);
    });
  });

  socket.on('projectsIndex', data => {
    Projects.find({ user: data.userId })
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().sort('uid DESC').then(projects => {
        socket.emit('projectsIndex', projects);
      }).catch(error => {
        ErrorsLogService.logError('Projects', error.toString(), 'projectsIndex', '', socket.user.id);
      });
  });

  socket.on('projectsCount', async data => {
    try {
      let count = await Projects.count({ user: data.userId });
      socket.emit('projectsCount', count);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'projectsCount', '', socket.user.id);
    }
  });

  //To search in data table of Projects
  socket.on('projectsSearch', async data => {
    let search = data.search;
    try {
      let count = await Projects.count({
        user: data.userId,
        or: [
          { uid: parseInt(search) },
          { docType: { contains: search } },
          { status: { contains: search } },
          { projectName: { contains: search } }
        ]
      });

      Projects.find({
        user: data.userId,
        or: [
          { uid: parseInt(search) },
          { docType: { contains: search } },
          { status: { contains: search } },
          { projectName: { contains: search } }
        ]
      }).limit(10).populateAll().sort('uid DESC').then(projects => {
        socket.emit('projectsSearch', { count: count, projects: projects });
      });
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'projectsSearch', '', socket.user.id);
    }
  });

  //To paginate search results of projects
  socket.on('projectsSearchIndex', data => {
    let search = data.search;
    Projects.find({
      user: data.userId,
      or: [
        { uid: parseInt(search) },
        { docType: { contains: search } },
        { status: { contains: search } },
        { projectName: { contains: search } }
      ]
    }).paginate({ page: data.pageIndex, limit: data.pageSize }).populateAll().sort('uid DESC').then(projects => {
      socket.emit('projectsSearchIndex', projects);
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'projectsSearch', '', socket.user.id);
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
        ErrorsLogService.logError('Projects', `email: ${email}, ` + error.toString(), 'sendEmail', socket.user.id);
        console.log(err);
      } else {
        socket.emit('sendEmail', {message: "Email sent."});
      }
    });
  });
})


module.exports = {
  userProjects: (req, res) => {
    Projects.find({
      user: req.params.id
    }).limit(req.param('limit') || 10).populateAll().sort('uid DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      ErrorsLogService.logError('Projects', `id: ${req.params.id}, ` + error.toString(), 'userProjects', req);
    });
  },

  getOutlineApprovedProjects: (req, res) => {
    Projects.find({
      user: req.params.id,
      outlineApproved: true
    }).sort('createdAt DESC').limit(10).then(projects => {
      res.ok(projects);
    }).catch(error => {
      ErrorsLogService.logError('Projects', `id: ${req.params.id}, ` + error.toString(), 'getOutlineApprovedProjects', req);
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
      }]
    }).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'getSubmittedProjects', req);
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
      ErrorsLogService.logError('Projects', error.toString(), 'getUserReport', req);
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
      ErrorsLogService.logError('Projects', err.toString(), 'resetCount', req);
      res.badRequest(err);
    });
  },

  submitOutline: (req, res) => {
    let body = req.body;
    Projects.create(body).then(projectResponse => {
      Projects.findOne({
        id: projectResponse.id
      }).populate('projectOutline').then(async project => {
        let projectOutline = await ProjectOutline.findOne({ id: project.projectOutline[0].id }).populateAll();

        let temp = {
          projectOutline: projectOutline,
          status: "Open",
          overallStatus: "Submitted",
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
          ErrorsLogService.logError('Projects', `projectId: ${projectResponse.id}, ` + error.toString(), 'submitOutline', req);
        })
      }).catch(error => {
        ErrorsLogService.logError('Projects', `projectId: ${projectResponse.id}, ` + error.toString(), 'submitOutline', req);
      })
    }).catch(error => {
      ErrorsLogService.logError('Projects', error.toString(), 'submitOutline', req);
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

          let projectOutline = await ProjectOutline.findOne({ id: outline.id }).populateAll();

          OutlineApproval.create({
            projectOutline: projectOutline,
            status: "Open",
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
          ErrorsLogService.logError('Projects', `id: ${req.params.id}, ` + error.toString(), 'submitOutlineUpdateCase', req);
        })
      }).catch(error => {
        ErrorsLogService.logError('Projects', `id: ${req.params.id}, ` + error.toString(), 'submitOutlineUpdateCase', req);
      })
    }).catch(error => {
      ErrorsLogService.logError('Projects', `id: ${req.params.id}, ` + error.toString(), 'submitOutlineUpdateCase', req);
    })
  },

  getRecentActiveProjects: async (req, res) => {
    try {
      let projectsList = await Projects.find({
        isClosed: false
      }).sort('createdAt', 'DESC').populateAll();

      res.ok(projectsList);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'getRecentActiveProjects', req);
    }
  },

  getClosedProjects: async (req, res) => {
    try {
      let projects = await Projects.find({
        isClosed: true
      }).sort('createdAt', 'DESC').populateAll();

      res.ok(projects);
    } catch (error) {
      ErrorsLogService.logError('Projects', error.toString(), 'getClosedProjects', req);
    }
  },
};
