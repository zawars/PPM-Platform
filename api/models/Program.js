/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
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
    programSponsor: {
      type: 'json'
    },
    uid: {
      type: 'integer',
      unique: true
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
  },

  beforeCreate: (values, cb) => {
    values.uid = ++EmailService.programCounter;
    cb();
  }
};

