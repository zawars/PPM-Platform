/**
 * ProjectsController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Email = require('machinepack-email');

module.exports = {
  userProjects: (req, res) => {
    Projects.find({
      user: req.params.id
    }).populate('projectOutline').populate('projectOrder').populate('changeRequests').populate('closingReport').sort('uid DESC').then(projects => {
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
      ]
    }).populate('projectOutline').populate('projectOrder').sort('createdAt DESC').limit(10).then(projects => {
      res.ok(projects);
    }).catch(error => {
      res.badRequest(error);
    });
  },

  getUserReport: async (req, res) => {
    try {
      let n = 0;
      let projects = await Projects.find({
        isCashedOut: false,
      }).populate('projectOutline').populate('projectOrder');
      let userArr = new Set();
      projects.forEach(async project => {
        userArr.add(project.projectOutline[0].projectManager.id);
        userArr.add(project.projectOutline[0].pmoOfficer.id);
        userArr.add(project.projectOutline[0].projectSponsor.id);
        userArr.add(project.projectOrder[0].projectManager.id);
        userArr.add(project.projectOrder[0].pmoOfficer.id);
        userArr.add(project.projectOrder[0].projectSponsor.id);
        userArr.add(project.projectOrder[0].projectFico.id);

        let report = await Reports.findOne({
          id: project.projectReport
        }).populate('team');
        let team = report.team;
        team.forEach(member => {
          userArr.add(member.name.id);
        });

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
  }
};
