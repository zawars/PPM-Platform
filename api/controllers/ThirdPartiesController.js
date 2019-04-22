/**
 * ThirdPartiesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const uuid = require('uuid/v5');

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
      res.badRequest(error);
    }
  },

  agilePlanning: async (req, res) => {
    try {
      let data = await Reports.find().populate('statusReports').populate('businessUnit').populate('businessArea');
      let agilePlanningData = [];

      data.map(obj => {
        delete (obj.projectManager.projects);
        delete (obj.projectManager.configuration);

        agilePlanningData.push({
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
      res.status(400).json({
        error
      });
    }
  }

};
