/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// sails.hooks.sockets.load(() => {
//   const io = sails.io;

//   io.on('connection', socket => {
//     socket.on('projectsCount', async data => {
//       let count = await Projects.count();
//       socket.emit('projectsCount', count);
//     });
//   });
// });

module.exports = {
  userProjects: (req, res) => {
    Projects.find({
      user: req.params.id
    }).populateAll().sort('uid DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      res.badRequest(error);
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
      }).populate('projectOutline').then(project => {
        let temp = {
          projectOutline: project.projectOutline[0],
          status: "Open",
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
        });
      });
    });
  },

  submitOutlineUpdateCase: (req, res) => {
    let body = req.body;
    let outline = JSON.parse(JSON.stringify(body.projectOutline));
    let backup = JSON.parse(JSON.stringify(body.projectOutline));
    delete(body.projectOutline);

    Projects.update({
      id: req.params.id
    }, body).then(projectResponse => {
      ProjectOutline.update({
        id: outline.id
      }, outline).then(outlineObj => {
        ProjectOutline.findOne({
          id: outline.id
        }).populate('projectId').then(populatedObj => {
          backup.projectId = populatedObj.projectId;
          backup.createdAt = populatedObj.createdAt;

          OutlineApproval.create({
            projectOutline: backup,
            status: "Open",
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
        });
      });
    });
  },

  getRecentActiveProjects: async (req, res) => {
    let projectsList = await Projects.find({
      isClosed: false
    }).sort('createdAt', 'DESC').populateAll();

    res.ok(projectsList);
  },

  getClosedProjects: async (req, res) => {
    let projects = await Projects.find({
      isClosed: true
    }).sort('createdAt', 'DESC').populateAll();

    res.ok(projects);
  },
};
