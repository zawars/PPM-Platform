/**
 * SmallOrder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    uid: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    purpose: {
      type: 'string'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    currentSituation: {
      type: 'string'
    },
    goals: {
      type: 'json'
    },
    deliverables:{
      type: 'json'
    },
    currency: {
      type: 'string'
    },
    qualitativeBenefits: {
      type: 'json'
    },
    quantitativeBenefits : {
      type: 'json'
    },
    budget : {
      type: 'json'
    },
    itPlatform: {
      type: 'json'
    },
    confidential: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    risks : {
      type: 'json'
    },
    reportRelevantRisksCount: {
      type: 'integer',
      defaultsTo: 0
    },
    mileStonesValues : {
      type: 'json'
    },
    reportRelevantMilestoneCount: {
      type: 'integer',
      defaultsTo: 0
    },
    measures : {
      type: 'json'
    },
    reportRelevantMeasuresCount: {
      type: 'integer',
      defaultsTo: 0
    },
    decisions : {
      type: 'json'
    },
    reportRelevantDecisionCount: {
      type: 'integer',
      defaultsTo: 0
    },
    costTypes: {
      type: 'json'
    },
    forecastEndDate: {
      type: 'string'
    },
    hasDraftReport: {
      type: 'boolean',
      defaultsTo: false
    },
    plannedEndDate: {
      type: 'string'
    },
    plannedDateVSForecastDate: {
      type: 'string'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    mandatoryProject: {
      model: 'dropdownMapper'
    },
    portfolio: {
      model: 'portfolio'
    },
    subPortfolio: {
      model: 'SubPortfolio'
    },
    businessUnit: {
      model: 'dropdownMapper'
    },
    businessArea: {
      model: 'dropdownMapper'
    },
    businessSegment: {
      model: 'dropdownMapper'
    },
    reportingLevel: {
      model: 'dropdownMapper'
    },
    classification: {
      model: 'dropdownMapper'
    },
    // projectType: {
    //   model: 'dropdownMapper'
    // },
    program: {
      model: 'program'
    },
    strategicContribution: {
      model: 'dropdownMapper'
    },
    feasibility: {
      model: 'dropdownMapper'
    },
    profitability: {
      model: 'dropdownMapper'
    },
    itRelevant: {
      model: 'dropdownMapper'
    },
    // projectMethodology: {
    //   model: 'dropdownMapper'
    // },
    user: {
      model: 'user',
    },
    orderManager: {
      model: 'user',
    },
    orderSponsor: {
      model: 'user',
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    smallOrderStatusReports: {
      collection: 'SmallOrderStatusReport',
      via: 'smallOrder'
    },

  },

  beforeCreate: (values, cb) => {
    EmailService.smallOrderCounter++;
    values.uid = 'A' + EmailService.smallOrderCounter;
    cb();
  }

};

