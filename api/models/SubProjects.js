/**
 * SubProjects.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    parentProject: {
      model: 'reports'
    },
    projectName: {
      type: 'string'
    },
    uid: {
      type: 'string',
      unique: true,
    },
    projectOutline: {
      type: 'json'
    },
    statusReports: {
      collection: 'statusReports',
      via: 'subProjectReports'
    },
  },

  beforeCreate: (values, cb) => {
    values.uid = ++EmailService.subProjectCounter;
    cb();
  }
};

