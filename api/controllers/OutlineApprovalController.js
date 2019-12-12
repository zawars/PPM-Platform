/**
 * OutlineApprovalController
 *
 * @description :: Server-side logic for managing Outlineapprovals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

sails.hooks.sockets.load(() => {
  const io = sails.io;

  io.on('connection', socket => {
    socket.on('approvalsCount', async data => {
      let count = await OutlineApproval.count();
      socket.emit('approvalsCount', count);
    });

    socket.on('approvalsIndexByUser', async data => {
      // TODO :: Need to poginate it
      let approvals = await OutlineApproval.find({
        assignedTo: data.userId
      }).populateAll().sort('createdAt DESC');
      socket.emit('approvalsIndexByUser', approvals);
    });
  });
});

module.exports = {
  getOutlinesByUser: (req, res) => {
    OutlineApproval.find({
      assignedTo: req.params.id
    }).populate('assignedTo').populate('project').sort('createdAt DESC').then(projects => {
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
  }
};
