/**
 * ClosingReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('fetchClosingReport', async data => {
    try {
      let project = await Projects.findOne({
        id: data.projectId
      }).populateAll();
      let detail = await Reports.findOne({
        id: project.projectReport.id
      }).populateAll();
      let closingReport;

      if (data.closingReportId != undefined && data.closingReportId != 0) {
        closingReport = await ClosingReport.findOne({
          id: data.closingReportId
        }).populateAll();
      }

      socket.emit('fetchClosingReport', {
        project,
        detail,
        closingReport
      });
    } catch (error) {
    }
  });
});

module.exports = {
  submitClosingReport: async (req, res) => {
    try {
      let body = req.body;

      let closingReportObj = await ClosingReport.create(body.obj);

      await Projects.update({
        id: body.projectId
      }).set(body.projectObj);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();
      let closingReport = await ClosingReport.findOne({
        id: closingReportObj.id
      }).populateAll();

      let temp = {
        closingReport: closingReport,
        status: "Open",
        overallStatus: "Submitted",
        docType: "Closing Report",
        sentTo: "PMO",
        projectStatus: 'Submitted',
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: 1,
        uid: project.uid
      };

      let approval = await OutlineApproval.create(temp);

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitClosingReportUpdateCase: async (req, res) => {
    try {
      let body = req.body;

      await ClosingReport.update({
        id: body.closingReportId
      }).set(body.obj);

      let closingReport = await ClosingReport.findOne({
        id: body.closingReportId
      }).populateAll();

      let projectObj = {
        closingReportApproved: false,
        docType: 'Closing Report',
        status: "Submitted",
        workflowStatus: 'Closing Report has been sent to PMO for approval.',
        isPMOApprovedClosingReport: false,
        isSponsorApprovedClosingReport: false,
        version: closingReport.version,
        closingReportSubmitted: true
      }

      await Projects.update({
        id: body.projectId
      }).set(projectObj);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();

      closingReport.project.isPMOApprovedClosingReport = false;
      closingReport.project.isSponsorApprovedClosingReport = false;

      let temp = {
        closingReport: closingReport,
        status: "Open",
        overallStatus: "Submitted",
        docType: "Closing Report",
        sentTo: "PMO",
        projectStatus: 'Submitted',
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: closingReport.version,
        uid: project.uid
      };

      let approval = await OutlineApproval.create(temp);

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },
};
