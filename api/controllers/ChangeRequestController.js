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
      ErrorsLogService.logError('Change Request', error.toString(), 'fetchChangeRequest', socket.user.id);
    }
  });
});

module.exports = {
  submitChangeRequest: async (req, res) => {
    try {
      let body = req.body;

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

      res.ok(approval);
    } catch (error) {
      ErrorsLogService.logError('Change Request', `projectId: ${req.body.projectId}, ` + error.toString(), 'submitChangeRequest', req);
      res.badRequest(error);
    }
  },

  submitChangeRequestUpdateCase: async (req, res) => {
    try {
      let body = req.body;

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

      res.ok(approval);
    } catch (error) {
      ErrorsLogService.logError('Change Request', `projectId: ${req.body.projectId}, ` + error.toString(), 'submitChangeRequestUpdateCase', req);
      res.badRequest(error);
    }
  },
};
