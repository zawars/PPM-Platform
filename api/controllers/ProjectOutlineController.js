/**
 * ProjectOutlineController
 *
 * @description :: Server-side logic for managing Projectoutlines
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('usersFromRoles', async data => {
    try {
      if (data.role == "PMO") {
        let users = await User.find({ role: data.role });
        let adminUsers = await User.find({ role: 'admin', isPmoAlso: true });
        socket.emit('usersFromRoles', [...users, ...adminUsers]);
      } else {
        let users = await User.find({ role: data.role });
        socket.emit('usersFromRoles', users);
      }
    } catch(error) {
      ErrorsLogService.logError('Project Outline', `role: ${data.role}, ` + error.toString(), 'usersFromRoles', socket.user.id);
    }
  });

  socket.on('fetchProjectOutline', async data => {
    try {
      let project = await Projects.findOne({ id: data.id }).populateAll();
      let projectOutline = await ProjectOutline.findOne({ id: project.projectOutline[0].id }).populateAll();
      socket.emit('fetchProjectOutline', { project, projectOutline });
    } catch (error) {
      ErrorsLogService.logError('Project Outline', error.toString(), 'fetchProjectOutline', socket.user.id);
    }
  });
});

module.exports = {

  updateProjectOutline: async (req, res) => {
    try {
      let body = req.body;

      await Projects.update({
        id: body.projectId
      }).set(body.project);

      await ProjectOutline.update({
        id: body.outline.id
      }).set(body.outline);

      res.ok({ message: 'Project Outline Updated' });
    } catch (error) {
      ErrorsLogService.logError('Project Outline', error.toString(), 'updateProjectOutline', req);
      res.badRequest(error);
    }
  },
};

