/**
 * ProjectOrderController
 *
 * @description :: Server-side logic for managing Projectorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('fetchProjectOrder', async data => {
    try {
      let project = await Projects.findOne({
        id: data.id
      }).populateAll();
      let detail;
      let order;

      if (project.projectOrder.length == 0) {
        detail = await Reports.findOne({
          id: project.projectReport.id
        }).populateAll();
      } else {
        order = await ProjectOrder.findOne({
          id: project.projectOrder[0].id
        }).populateAll();
      }
      socket.emit('fetchProjectOrder', {
        project,
        detail,
        order
      });
    } catch (error) {
    }
  });
});

module.exports = {

  updateProjectOrder: async (req, res) => {
    try {
      let body = req.body;

      await Projects.update({
        id: body.projectId
      }).set(body.project);

      await ProjectOrder.update({
        id: body.order.id
      }).set(body.order);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();

      res.ok(project);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitOrder: async (req, res) => {
    try {
      let body = req.body;

      let todaysDate = new Date()
      let offset = todaysDate.getTimezoneOffset()
      todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000))
      todaysDate = todaysDate.toISOString().split('T')[0]

      let pmo = body.formObject.pmoOfficer;
      let pmoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: pmo.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (pmoVacationMode != null) {
        delete pmoVacationMode.backupUser.tablesState;
        body.obj.projectOrder.isPmoBackup = true;
        body.obj.projectOrder.originalPmoOfficer = body.obj.projectOrder.pmoOfficer;  
        body.formObject.pmoOfficer = pmoVacationMode.backupUser;
        body.obj.projectOrder.pmoOfficer = pmoVacationMode.backupUser;
      }

      // let sponsor = body.obj.projectOrder.projectSponsor;
      // let sponsorVacationMode = await VacationMode.findOne({ isVacationActive: true, user: sponsor.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      // if (sponsorVacationMode != null) {
      //   delete sponsorVacationMode.backupUser.tablesState;
      //   body.obj.projectOrder.isSponsorBackup = true;
      //   body.obj.projectOrder.originalProjectSponsor = body.obj.projectOrder.projectSponsor;  
      //   body.obj.projectOrder.projectSponsor = sponsorVacationMode.backupUser;
      // }

      // let fico = body.obj.projectOrder.projectFico;
      // let ficoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: fico.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      // if (ficoVacationMode != null) {
      //   delete ficoVacationMode.backupUser.tablesState;
      //   body.obj.projectOrder.isFicoBackup = true;
      //   body.obj.projectOrder.originalProjectFico = body.obj.projectOrder.projectFico;  
      //   body.obj.projectOrder.projectFico = ficoVacationMode.backupUser;
      // }

      await Projects.update({
        id: body.projectId
      }).set(body.obj);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();
      let order = await ProjectOrder.findOne({
        id: project.projectOrder[0].id
      }).populateAll();

      let temp = {
        projectOrder: order,
        status: "Open",
        overallStatus: "Submitted",
        projectStatus: 'Submitted',
        docType: "Order",
        sentTo: "PMO",
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: order.version,
        uid: project.uid
      };

      let approval = await OutlineApproval.create(temp);
      approval.pmoOfficer = body.obj.projectOrder.pmoOfficer;

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitOrderUpdateCase: async (req, res) => {
    try {
      let body = req.body;

      let todaysDate = new Date()
      let offset = todaysDate.getTimezoneOffset()
      todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000))
      todaysDate = todaysDate.toISOString().split('T')[0]

      let pmo = body.formObject.pmoOfficer;
      let pmoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: pmo.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      if (pmoVacationMode != null) {
        body.order.isPmoBackup = true;
        body.order.originalPmoOfficer = body.order.pmoOfficer;  
        body.formObject.pmoOfficer = pmoVacationMode.backupUser;
        body.order.pmoOfficer = pmoVacationMode.backupUser;
      }

      // let sponsor = body.order.projectSponsor;
      // let sponsorVacationMode = await VacationMode.findOne({ isVacationActive: true, user: sponsor.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      // if (sponsorVacationMode != null) {
      //   body.order.isSponsorBackup = true;
      //   body.order.originalProjectSponsor = body.order.projectSponsor;  
      //   body.order.projectSponsor = sponsorVacationMode.backupUser;
      // }

      // let fico = body.order.projectFico;
      // let ficoVacationMode = await VacationMode.findOne({ isVacationActive: true, user: fico.id, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 }).populateAll();
      // if (ficoVacationMode != null) {
      //   body.order.isFicoBackup = true;
      //   body.order.originalProjectFico = body.order.projectFico;  
      //   body.order.projectFico = ficoVacationMode.backupUser;
      // }

      await Projects.update({
        id: body.projectId
      }).set(body.obj);

      await ProjectOrder.update({
        id: body.order.id
      }).set(body.order);

      let project = await Projects.findOne({
        id: body.projectId
      }).populateAll();
      let order = await ProjectOrder.findOne({
        id: body.order.id
      }).populateAll();

      let temp = {
        projectOrder: order,
        status: "Open",
        overallStatus: "Submitted",
        projectStatus: 'Submitted',
        docType: "Order",
        sentTo: "PMO",
        assignedTo: body.formObject.pmoOfficer.id,
        project: project.id,
        isFreezed: false,
        version: order.version,
        uid: project.uid
      };

      let approval = await OutlineApproval.create(temp);
      approval.pmoOfficer = body.order.pmoOfficer;

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },
};
