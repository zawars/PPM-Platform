/**
 * SmallOrderStatusReport.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    reportingDate: {
      type: 'string'
    },
    percentageComplete: {
      type: 'integer'
    },
    overallStatus: {
      type: 'string'
    },
    managementSummary: {
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
    isSubmitted: {
      type: 'boolean'
    },
    status: {
      type: 'string'
    },
    risks : {
      type: 'json'
    },
    mileStonesValues : {
      type: 'json'
    },
    measures : {
      type: 'json'
    },
    decisions : {
      type: 'json'
    },
    costTypes: {
      type: 'json'
    },
    currentBudgetVSForecast: {
      type: 'string'
    },
    riskExposureVsCurrentBudget: {
      type: 'string'
    },
    submittedDate: {
      type: 'string'
    },
    businessArea: {
      type: 'string'
    },
    strategicContribution: {
      type: 'string'
    },
    feasibility: {
      type: 'string'
    },
    profitability: {
      type: 'string'
    },
    plannedDateVSForecastDate: {
      type: 'string'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    smallOrder: {
      model: 'smallOrder',
    },
    orderManager: {
      model: 'user',
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

