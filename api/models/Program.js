/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    uid: {
      type: 'integer',
      unique: true
    },
    reports: {
      collection: 'Reports',
      via: 'program'
    },
    programName: {
      type: 'string'
    },
    goalsAndObjectives: {
      type: 'string'
    },
    programManager: {
      model: 'user'
    },
    additionalProgramManager: {
      model: 'user'
    },
    programSponsor: {
      model: 'user'
    },
    programBudgetOriginal: {
      type: 'integer'
    },
    programBudgetCurrent: {
      type: 'integer'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },

    statusReports: {
      collection: 'programStatusReports',
      via: 'program'
    },
    smallOrders: {
      collection: 'smallOrder',
      via: 'program'
    },
  },

  beforeCreate: (values, cb) => {
    values.uid = ++EmailService.programCounter;
    cb();
  }
};
