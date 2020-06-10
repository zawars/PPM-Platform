/**
 * OutlineApprovalController
 *
 * @description :: Server-side logic for managing Outlineapprovals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

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
        ErrorsLogService.logError('Outline Approval', error.toString(), 'approvalsIndex', '', socket.user.id);
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
      ErrorsLogService.logError('Outline Approval', error.toString(), 'approvalsCount', '', socket.user.id);
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
      ErrorsLogService.logError('Outline Approval', `id: ${req.params.id}, ` + error.toString(), 'userOpenOutlinesCount', '', socket.user.id);
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
        ErrorsLogService.logError('Outline Approval', error.toString(), 'approvalsSearch', '', socket.user.id);
      })
    } catch (error) {
      ErrorsLogService.logError('Outline Approval', error.toString(), 'approvalsSearch', '', socket.user.id);
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
      ErrorsLogService.logError('Outline Approval', error.toString(), 'approvalsSearch', '', socket.user.id);
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
      ErrorsLogService.logError('Outline Approval', error.toString(), 'getOutlinesByPMO', '', socket.user.id);
    }
  });

})


module.exports = {
  getOutlinesByUser: (req, res) => {
    OutlineApproval.find({
      assignedTo: req.params.id
    }).limit(req.query.limit || 10).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      ErrorsLogService.logError('Outline Approval', `id: ${req.params.id}, ` + error.toString(), 'getOutlinesByUser', req);
    })
  },

  getOutlinesByProject: (req, res) => {
    OutlineApproval.find({
      project: req.params.id
    }).limit(req.query.limit || 10).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    }).catch(error => {
      ErrorsLogService.logError('Outline Approval', `id: ${req.params.id}, ` + error.toString(), 'getOutlinesByProject', req);
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
      ErrorsLogService.logError('Outline Approval', error.toString(), 'updateApprovalOwner', req);
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
      ErrorsLogService.logError('Outline Approval', `query: ${query}, ` + error.toString(), 'updatePreviousApproval', req);
    });
  }
};
