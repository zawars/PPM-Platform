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
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('approvalsIndex', projects);
      })
      .catch(error => {
        socket.emit('approvalsIndex', error);
      });
  });

  //To get count of total Aprovals for user
  socket.on('approvalsCount', async data => {
    let count = await OutlineApproval.count({ assignedTo: data.userId });
    socket.emit('approvalsCount', count);
  });

  //To search in data table of Approvals
  socket.on('approvalsSearch', async data => {
    let search = data.search;
    try {
      let count = await OutlineApproval.count({
        assignedTo: data.userId,
        or: [
          { uid: parseInt(search) },
          { version: parseInt(search) },
          { sentTo: { contains: search } },
          { docType: { contains: search } },
          { status: { contains: search } },
          { 'projectOutline.projectName': { contains: search } },
          { 'projectOrder.projectName': { contains: search } },
          { 'changeRequest.projectName': { contains: search } },
          { 'closingReport.projectName': { contains: search } },
          { 'projectOutline.projectManager.name': { contains: search } },
          { 'projectOrder.projectManager.name': { contains: search } },
          { 'changeRequest.projectManager.name': { contains: search } },
          { 'closingReport.projectManager.name': { contains: search } },
        ]
      });

      OutlineApproval.find({
        assignedTo: data.userId,
        or: [
          { uid: parseInt(search) },
          { version: parseInt(search) },
          { sentTo: { contains: search } },
          { docType: { contains: search } },
          { status: { contains: search } },
          { 'projectOutline.projectName': { contains: search } },
          { 'projectOrder.projectName': { contains: search } },
          { 'changeRequest.projectName': { contains: search } },
          { 'closingReport.projectName': { contains: search } },
          { 'projectOutline.projectManager.name': { contains: search } },
          { 'projectOrder.projectManager.name': { contains: search } },
          { 'changeRequest.projectManager.name': { contains: search } },
          { 'closingReport.projectManager.name': { contains: search } },
        ]
      }).limit(10).populateAll().sort('createdAt DESC').then(projects => {
        socket.emit('approvalsSearch', { count: count, approvals: projects });
      });
    } catch (error) {
      console.log(error);
    }
  });

  //To paginate search results of approvals
  socket.on('approvalsSearchIndex', data => {
    let search = data.search;
    OutlineApproval.find({
      assignedTo: data.userId,
      or: [
        { uid: parseInt(search) },
        { version: parseInt(search) },
        { sentTo: { contains: search } },
        { docType: { contains: search } },
        { status: { contains: search } },
        { 'projectOutline.projectName': { contains: search } },
        { 'projectOrder.projectName': { contains: search } },
        { 'changeRequest.projectName': { contains: search } },
        { 'closingReport.projectName': { contains: search } },
        { 'projectOutline.projectManager.name': { contains: search } },
        { 'projectOrder.projectManager.name': { contains: search } },
        { 'changeRequest.projectManager.name': { contains: search } },
        { 'closingReport.projectManager.name': { contains: search } },
      ]
    }).paginate({ page: data.pageIndex, limit: data.pageSize }).populateAll().sort('createdAt DESC').then(projects => {
      socket.emit('approvalsSearchIndex', projects);
    });
  });

})



module.exports = {
  getOutlinesByUser: (req, res) => {
    let limit = 0;
    if (req.param('limit')) {
      limit = req.param('limit');
    }
    OutlineApproval.find({
      assignedTo: req.params.id
    }).limit(limit).populateAll().sort('createdAt DESC').then(projects => {
      res.ok(projects);
    });
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
    });
  },

  updatePreviousApproval: (req, resp) => {
    let query = req.body.query;
    let projectItem = req.body.projectItem;
    OutlineApproval.update(query).set(projectItem)
      .then(() => {
        resp.ok({
          message: "Previous Approval has been updated."
        });
      });
  }
};
