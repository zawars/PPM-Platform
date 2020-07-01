/**
 * Reports.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    uid: {
      type: 'integer',
    },
    projectOutline: {
      type: 'json',
    },
    projectName: {
      type: 'string',
    },
    user: {
      model: 'user',
    },
    projectOrder: {
      type: 'json',
    },
    statusReports: {
      collection: 'statusReports',
      via: 'projectReport'
    },
    portfolio: {
      model: 'portfolio'
    },
    subPortfolio: {
      model: 'subPortfolio'
    },
    program: {
      model: 'program'
    },
    EVA: {
      type: 'json'
    },
    decisions: {
      type: 'json'
    },
    risks: {
      type: 'json'
    },
    documents: {
      collection: 'documents',
      via: 'report'
    },
    lessonsLearned: {
      type: 'json'
    },
    subProjects: {
      collection: 'subProjects',
      via: 'parentProject'
    },
    project: {
      model: 'projects'
    },
    companyName: {
      model: 'dropdownMapper'
    },
    mandatoryProject: {
      model: 'dropdownMapper'
    },
    businessArea: {
      model: 'dropdownMapper'
    },
    businessUnit: {
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
    projectType: {
      model: 'dropdownMapper'
    },
    strategicContribution: {
      model: 'dropdownMapper'
    },
    profitability: {
      model: 'dropdownMapper'
    },
    feasibility: {
      model: 'dropdownMapper'
    },
    projectPhase: {
      model: 'dropdownMapper'
    },
    riskCategory: {
      model: 'dropdownMapper'
    },
    documentType: {
      model: 'dropdownMapper'
    },
    projectMethodology: {
      model: 'dropdownMapper'
    },
    itRelevant: {
      model: 'dropdownMapper'
    },
    currentReserveHistory: {
      type: 'json'
    },
    hasDraftReport: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
