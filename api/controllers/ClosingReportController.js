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

      let todaysDate = new Date()
      let offset = todaysDate.getTimezoneOffset()
      todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000))
      todaysDate = todaysDate.toISOString().split('T')[0]

      let pmo = body.obj.pmoOfficer;
      let pmoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: pmo.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (pmoVacationMode != null) {
        body.obj.isPmoBackup = true;
        body.obj.originalPmoOfficer = body.obj.pmoOfficer;  
        body.obj.pmoOfficer = pmoVacationMode.backupUser;
        body.formObject.pmoOfficer = pmoVacationMode.backupUser;
      }

      let sponsor = body.obj.projectSponsor;
      let sponsorVacationMode = await VacationMode.findOne({ isVacationActive: true, user: sponsor.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (sponsorVacationMode != null) {
        body.obj.isSponsorBackup = true;
        body.obj.originalProjectSponsor = body.obj.projectSponsor;  
        body.obj.projectSponsor = sponsorVacationMode.backupUser;
      }

      let fico = body.obj.projectFico;
      let ficoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: fico.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (ficoVacationMode != null) {
        body.obj.isFicoBackup = true;
        body.obj.originalProjectFico = body.obj.projectFico;  
        body.obj.projectFico = ficoVacationMode.backupUser;
      }

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
      approval.pmoOfficer = body.formObject.pmoOfficer;

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitClosingReportUpdateCase: async (req, res) => {
    try {
      let body = req.body;

      let todaysDate = new Date()
      let offset = todaysDate.getTimezoneOffset()
      todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000))
      todaysDate = todaysDate.toISOString().split('T')[0]

      let pmo = body.obj.pmoOfficer;
      let pmoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: pmo.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (pmoVacationMode != null) {
        delete pmoVacationMode.backupUser.tablesState;
        body.obj.isPmoBackup = true;
        body.obj.originalPmoOfficer = body.obj.pmoOfficer;  
        body.obj.pmoOfficer = pmoVacationMode.backupUser;
        body.formObject.pmoOfficer = pmoVacationMode.backupUser;
      }

      let sponsor = body.obj.projectSponsor;
      let sponsorVacationMode = await VacationMode.findOne({ isVacationActive: true, user: sponsor.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (sponsorVacationMode != null) {
        delete sponsorVacationMode.backupUser.tablesState;
        body.obj.isSponsorBackup = true;
        body.obj.originalProjectSponsor = body.obj.projectSponsor;  
        body.obj.projectSponsor = sponsorVacationMode.backupUser;
      }

      let fico = body.obj.projectFico;
      let ficoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: fico.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (ficoVacationMode != null) {
        delete ficoVacationMode.backupUser.tablesState;
        body.obj.isFicoBackup = true;
        body.obj.originalProjectFico = body.obj.projectFico;
        body.obj.projectFico = ficoVacationMode.backupUser;
      }

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
      approval.pmoOfficer = body.formObject.pmoOfficer;

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },
};
