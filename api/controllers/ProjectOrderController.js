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

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },

  submitOrderUpdateCase: async (req, res) => {
    try {
      let body = req.body;

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

      res.ok(approval);
    } catch (error) {
      res.badRequest(error);
    }
  },
};
