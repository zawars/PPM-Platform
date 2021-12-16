/**
 * OutlineApprovalController
 *
 * @description :: Server-side logic for managing Outlineapprovals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {


  socket.on('ApprovalsFilterCount', async data => {
    try {
      let filters = data.filtersArray;
      let filtersObj = {};

      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        if (filtersObj[key]) {
          let presentFil = filtersObj[key];
          filtersObj[key] = presentFil.concat(filter[key])
        } else {
          filtersObj[key] = filter[key];
        }
      })

      let approvalsResultCount = await OutlineApproval.count({
        assignedTo: data.userId
      }).where(filtersObj);

      socket.emit('ApprovalsFilterCount', approvalsResultCount);
    } catch (error) {
    }
  });

  socket.on('ApprovalsFilter', async data => {
    try {
      let filters = data.filtersArray;
      let filtersObj = {};

      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        if (filtersObj[key]) {
          let presentFil = filtersObj[key];
          filtersObj[key] = presentFil.concat(filter[key])
        } else {
          filtersObj[key] = filter[key];
        }
      })

      let approvalsResult = await OutlineApproval.find({
        assignedTo: data.userId
      }).where(filtersObj).sort('createdAt DESC').paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populateAll();

      socket.emit('ApprovalsFilter', approvalsResult);
    } catch (error) {
    }
  });


  //To paginate approvals table
  socket.on('approvalsIndex', data => {
    OutlineApproval.find({
      assignedTo: data.userId
    })
      .paginate({
        page: data.pageIndex,
        limit: data.pageSize
      })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('approvalsIndex', projects);
      })
      .catch(error => {
      });
  });

  //To get count of total Aprovals for user
  socket.on('approvalsCount', async data => {
    try {
      let count = await OutlineApproval.count({
        assignedTo: data.userId
      });
      socket.emit('approvalsCount', count);
    } catch (error) {
    }
  });

  //To get count of user's open outlines
  socket.on('userOpenOutlinesCount', async data => {
    try {
      let openOutlinesCount = await OutlineApproval.count({
        assignedTo: data.id,
        isFreezed: false
      });

      socket.emit('userOpenOutlinesCount', openOutlinesCount);

    } catch (error) {
    }
  })

  //To search in data table of Approvals
  socket.on('approvalsSearch', async data => {
    let search = data.search;
    try {
      let count = await OutlineApproval.count({
        assignedTo: data.userId,
        or: [{
          uid: parseInt(search)
        },
        {
          version: parseInt(search)
        },
        {
          sentTo: {
            contains: search
          }
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
          'projectOutline.projectName': {
            contains: search
          }
        },
        {
          'projectOrder.projectName': {
            contains: search
          }
        },
        {
          'changeRequest.projectName': {
            contains: search
          }
        },
        {
          'closingReport.projectName': {
            contains: search
          }
        },
        {
          'projectOutline.projectManager.name': {
            contains: search
          }
        },
        {
          'projectOrder.projectManager.name': {
            contains: search
          }
        },
        {
          'changeRequest.projectManager.name': {
            contains: search
          }
        },
        {
          'closingReport.projectManager.name': {
            contains: search
          }
        },
        ]
      });

      OutlineApproval.find({
        assignedTo: data.userId,
        or: [{
          uid: parseInt(search)
        },
        {
          version: parseInt(search)
        },
        {
          sentTo: {
            contains: search
          }
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
          'projectOutline.projectName': {
            contains: search
          }
        },
        {
          'projectOrder.projectName': {
            contains: search
          }
        },
        {
          'changeRequest.projectName': {
            contains: search
          }
        },
        {
          'closingReport.projectName': {
            contains: search
          }
        },
        {
          'projectOutline.projectManager.name': {
            contains: search
          }
        },
        {
          'projectOrder.projectManager.name': {
            contains: search
          }
        },
        {
          'changeRequest.projectManager.name': {
            contains: search
          }
        },
        {
          'closingReport.projectManager.name': {
            contains: search
          }
        },
        ]
      }).limit(10).populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('approvalsSearch', {
          count: count,
          approvals: projects
        });
      }).catch(error => {
      })
    } catch (error) {
    }
  });

  //To paginate search results of approvals
  socket.on('approvalsSearchIndex', data => {
    let search = data.search;
    OutlineApproval.find({
      assignedTo: data.userId,
      or: [{
        uid: parseInt(search)
      },
      {
        version: parseInt(search)
      },
      {
        sentTo: {
          contains: search
        }
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
        'projectOutline.projectName': {
          contains: search
        }
      },
      {
        'projectOrder.projectName': {
          contains: search
        }
      },
      {
        'changeRequest.projectName': {
          contains: search
        }
      },
      {
        'closingReport.projectName': {
          contains: search
        }
      },
      {
        'projectOutline.projectManager.name': {
          contains: search
        }
      },
      {
        'projectOrder.projectManager.name': {
          contains: search
        }
      },
      {
        'changeRequest.projectManager.name': {
          contains: search
        }
      },
      {
        'closingReport.projectManager.name': {
          contains: search
        }
      },
      ]
    }).paginate({
      page: data.pageIndex,
      limit: data.pageSize
    }).populateAll().sort('createdAt DESC').then(projects => {
      socket.emit('approvalsSearchIndex', projects);
    }).catch(error => {
    });
  });

  //To get outlines by PMO
  socket.on('getOutlinesByPMO', async data => {
    try {
      let approvals = await OutlineApproval.find({
        sentTo: 'PMO'
      }).populateAll();
      socket.emit('getOutlinesByPMO', approvals);
    } catch (error) {
    }
  });

})


module.exports = {
  outlineApproval: async (req, res) => {
    let body = req.body;

    let todaysDate = new Date();
    let offset = todaysDate.getTimezoneOffset();
    todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000));
    todaysDate = todaysDate.toISOString().split('T')[0];
    let assignedPerson = body.assignedTo;
    let assignedPersonVacationMode = await VacationMode.findOne({ isVacationActive: true, user: assignedPerson, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
    if (assignedPersonVacationMode != null) {
      if (body.docType == 'Outline' && body.sentTo == 'Sponsor') {
        body.assignedTo = assignedPersonVacationMode.backupUser.id;
        body.projectOutline.isSponsorBackup = true;
        body.projectOutline.originalProjectSponsor = body.projectOutline.projectSponsor;
        body.projectOutline.projectSponsor = assignedPersonVacationMode.backupUser;

        await ProjectOutline.update({ id: body.projectOutline.id }).set({ isSponsorBackup: true, originalProjectSponsor: body.projectOutline.originalProjectSponsor, projectSponsor: body.projectOutline.projectSponsor })
      }

      if (body.docType == 'Order') {
        if (body.sentTo == 'Sponsor') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.projectOrder.isSponsorBackup = true;
          body.projectOrder.originalProjectSponsor = body.projectOrder.projectSponsor;
          body.projectOrder.projectSponsor = assignedPersonVacationMode.backupUser;

          await ProjectOrder.update({ id: body.projectOrder.id }).set({ isSponsorBackup: true, originalProjectSponsor: body.projectOrder.originalProjectSponsor, projectSponsor: body.projectOrder.projectSponsor })
        }

        if (body.sentTo == 'FICO') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.projectOrder.isFicoBackup = true;
          body.projectOrder.originalProjectFico = body.projectOrder.projectFico;
          body.projectOrder.projectFico = assignedPersonVacationMode.backupUser;

          await ProjectOrder.update({ id: body.projectOrder.id }).set({ isFicoBackup: true, originalProjectFico: body.projectOrder.originalProjectFico, projectFico: body.projectOrder.projectFico })
        }
      }

      if (body.docType == 'Change Request') {
        if (body.sentTo == 'Sponsor') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.changeRequest.isSponsorBackup = true;
          body.changeRequest.originalProjectSponsor = body.changeRequest.projectSponsor;
          body.changeRequest.projectSponsor = assignedPersonVacationMode.backupUser;

          await ChangeRequest.update({ id: body.changeRequest.id }).set({ isSponsorBackup: true, originalProjectSponsor: body.changeRequest.originalProjectSponsor, projectSponsor: body.changeRequest.projectSponsor })
        }

        if (body.sentTo == 'FICO') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.changeRequest.isFicoBackup = true;
          body.changeRequest.originalProjectFico = body.changeRequest.projectFico;
          body.changeRequest.projectFico = assignedPersonVacationMode.backupUser;

          await ChangeRequest.update({ id: body.changeRequest.id }).set({ isFicoBackup: true, originalProjectFico: body.changeRequest.originalProjectFico, projectFico: body.changeRequest.projectFico })
        }
      }

      if (body.docType == 'Closing Report') {
        if (body.sentTo == 'Sponsor') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.closingReport.isSponsorBackup = true;
          body.closingReport.originalProjectSponsor = body.closingReport.projectSponsor;
          body.closingReport.projectSponsor = assignedPersonVacationMode.backupUser;

          await ClosingReport.update({ id: body.closingReport.id }).set({ isSponsorBackup: true, originalProjectSponsor: body.closingReport.originalProjectSponsor, projectSponsor: body.closingReport.projectSponsor })
        }

        if (body.sentTo == 'FICO') {
          body.assignedTo = assignedPersonVacationMode.backupUser.id;
          body.closingReport.isFicoBackup = true;
          body.closingReport.originalProjectFico = body.closingReport.projectFico;
          body.closingReport.projectFico = assignedPersonVacationMode.backupUser;

          await ClosingReport.update({ id: body.closingReport.id }).set({ isFicoBackup: true, originalProjectFico: body.closingReport.originalProjectFico, projectFico: body.closingReport.projectFico })
        }
      }
    }

    let createdOutline = await OutlineApproval.create(body);
    res.ok(createdOutline);
  },

  getOutlinesByUser: (req, res) => {
    OutlineApproval.find({
      assignedTo: req.params.id
    }).limit(req.query.limit || 10).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
    })
  },

  getOutlinesByProject: (req, res) => {
    OutlineApproval.find({
      project: req.params.id
    }).limit(req.query.limit || 10).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
    })
  },

  updateApprovalOwner: (req, res) => {
    OutlineApproval.update({
      assignedTo: req.body.prev,
      project: req.body.project,
      sentTo: req.body.sentTo
    }).set({
      assignedTo: req.body.new
    }).then(() => {
      res.ok({
        message: "Approvals assigned person has been updated."
      });
    }).catch(error => {
    });
  },

  updatePreviousApproval: (req, resp) => {
    let query = req.body.query;
    let projectItem = req.body.projectItem;

    OutlineApproval.update(query).set(projectItem).then((data) => {
      resp.ok({
        message: "Previous Approval has been updated."
      });
    }).catch(error => {
    });
  }
};
