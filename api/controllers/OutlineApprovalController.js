/**
 * OutlineApprovalController
 *
 * @description :: Server-side logic for managing Outlineapprovals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getOutlinesByUser: (req, res) => {
    OutlineApproval.find({
      assignedTo: req.params.id
    }).populateAll().sort('createdAt DESC').then(projects => {
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
