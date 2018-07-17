/**
 * ProgramStatusReports.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    reportingDate: {
      type: 'string'
    },
    percentageComplete: {
      type: 'integer'
    },
    overallStatus: {
      type: 'string'
    },
    overallStatusComments: {
      type: 'string'
    },
    scopeStatus: {
      type: 'string'
    },
    scopeStatusComments: {
      type: 'string'
    },
    costStatus: {
      type: 'string'
    },
    costStatusComments: {
      type: 'string'
    },
    timeStatus: {
      type: 'string'
    },
    timeStatusComments: {
      type: 'string'
    },
    riskStatus: {
      type: 'string'
    },
    riskStatusComments: {
      type: 'string'
    },
    managementSummary: {
      type: 'string'
    },
    problemsAndNecessaryDecisions: {
      type: 'string'
    },
    report: {
      type: 'string'
    },
    isSubmitted: {
      type: 'boolean'
    },
    status: {
      type: 'string'
    },
    program: {
      model: 'program'
    },
    programId: {
      type: 'string'
    },
  }
};

