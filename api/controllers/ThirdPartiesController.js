/**
 * ThirdPartiesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const uuid = require('uuid/v5');
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('thirdPartiesCount', async data => {
    try {
      let count = await ThirdParties.count();
      socket.emit('thirdPartiesCount', count);
    } catch (error) {
      ErrorsLogService.logError('Third Parties', error.toString(), 'thirdPartiesCount', '', socket.user.id);
    }
  })

  socket.on('thirdPartiesIndex', data => {
    ThirdParties.find()
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(parties => {
        socket.emit('thirdPartiesIndex', parties);
      }).catch(error => {
        ErrorsLogService.logError('Third Parties', error.toString(), 'thirdPartiesIndex', '', socket.user.id);
      })
  })
});

module.exports = {
  register: async (req, res) => {
    try {
      let data = req.body;
      let appId = uuid(data.name + Date.now(), uuid.URL);
      let secret = uuid(sails.config.secret + data.authCode, appId);

      let thirdPartyData = await ThirdParties.create({
        ...data,
        applicationId: appId,
        secret
      });

      res.ok({
        data: thirdPartyData,
        message: 'Application created',
      });
    } catch (error) {
      ErrorsLogService.logError('Third Parties', error.toString(), 'register', req);
      res.badRequest(error);
    }
  },

  agilePlanning: async (req, res) => {
    try {
      let data = await Reports.find().populateAll();
      let agilePlanningData = [];

      data.map(obj => {
        delete(obj.projectManager.projects);
        delete(obj.projectManager.configuration);

        agilePlanningData.push({
          uid: obj.uid,
          projectName: obj.projectName,
          purpose: obj.purpose,
          startDate: obj.startDate,
          endDate: obj.endDate,
          phase: obj.statusReports.length > 0 ? obj.statusReports[obj.statusReports.length - 1].projectPhase : '',
          status: obj.status,
          digitalizationTopic: obj.digitalizationTopic,
          digitalizationFocus: obj.digitalizationFocus,
          technology: obj.technology,
          digitalizationDegree: obj.digitalizationDegree,
          businessUnit: obj.businessUnit,
          businessArea: obj.businessArea,
          projectManager: obj.projectManager,
          projectSponsor: obj.projectSponsor
        });
      });

      res.ok({
        data: agilePlanningData,
      });
    } catch (error) {
      ErrorsLogService.logError('Third Parties', error.toString(), 'agilePlanning', req);
      res.status(400).json({
        error
      });
    }
  }

};
