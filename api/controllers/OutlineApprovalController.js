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
    }).populate('assignedTo').populate('project').sort('createdAt DESC').then(projects => {
      res.ok(projects);
    });
  },

  updateApprovalSponsor: (req, res) => {
    OutlineApproval.update({
      assignedTo: req.body.prev,
      project: req.body.project
    }).set({
      assignedTo: req.body.new
    }).then(() => {
      res.ok({
        message: "Approvals assigned person has been updated."
      });
    });
  }
};
