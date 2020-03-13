/**
 * SubportfolioStatusReport.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
  //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
  //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

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
    subportfolio: {
      model: 'subportfolio'
    }
  }

  //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
  //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
  //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


  //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
  //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
};
