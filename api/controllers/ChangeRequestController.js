/**
 * ChangeRequestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('fetchChangeRequest', async data => {
    try {
      let project = await Projects.findOne({
        id: data.projectId
      }).populateAll();
      delete(project.approvals);
      let detail;
      let changeRequest;

      if (data.changeRequestId == undefined || data.changeRequestId == 0) {
        detail = await Reports.findOne({
          id: project.projectReport.id
        }).populateAll();
      } else {
        changeRequest = await ChangeRequest.findOne({
          id: data.changeRequestId
        }).populateAll();
      }

      socket.emit('fetchChangeRequest', {
        project,
        detail,
        changeRequest
      });
    } catch (error) {
    }
  });
});

module.exports = {
  submitChangeRequest: async (req, res) => {
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

      let changeRequestObj = await ChangeRequest.create(body.obj);

      await Projects.update({
        id: body.projectId
      }).set(body.projectObj);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();
      let changeRequest = await ChangeRequest.findOne({
        id: changeRequestObj.id
      }).populateAll();

      let temp = {
        changeRequest: changeRequest,
        status: "Open",
        overallStatus: "Submitted",
        docType: "Change Request",
        sentTo: "PMO",
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: 1,
        crNo: changeRequest.crNo,
        uid: project.uid
      };

      let approval = await OutlineApproval.create(temp);
      approval.pmoOfficer = body.formObject.pmoOfficer;

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitChangeRequestUpdateCase: async (req, res) => {
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

      await ChangeRequest.update({
        id: body.changeRequestId
      }).set(body.obj);

      let changeRequest = await ChangeRequest.findOne({
        id: body.changeRequestId
      }).populateAll();
      let projectObj = {
        changeRequestMade: true,
        docType: 'Change Request',
        changeRequestApproved: false,
        workflowStatus: 'Change Request has been sent to PMO for approval.',
        version: changeRequest.version != undefined ? changeRequest.version : 1,
        status: "Submitted",
        subPortfolio: body.formObject.subPortfolio
      }

      await Projects.update({
        id: body.projectId
      }).set(projectObj);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();

      let temp = {
        changeRequest: changeRequest,
        status: "Open",
        overallStatus: "Submitted",
        docType: "Change Request",
        sentTo: "PMO",
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: changeRequest.version,
        crNo: changeRequest.crNo,
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
