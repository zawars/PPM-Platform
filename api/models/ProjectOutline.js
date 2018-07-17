/**
 * ProjectOutline.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    projectId: {
      model: "projects",
      unique: true
    },
    version: {
      type: "integer"
    },
    attachments: {
      type: "json"
    },
    companyName: {
      model: "dropdownMapper"
    },
    mandatoryProject: {
      model: "dropdownMapper"
    },
    businessUnit: {
      model: "dropdownMapper"
    },
    businessArea: {
      model: "dropdownMapper"
    },
    businessSegment: {
      model: "dropdownMapper"
    },
    reportingLevel: {
      model: "dropdownMapper"
    },
    classification: {
      model: "dropdownMapper"
    },
    projectType: {
      model: "dropdownMapper"
    },
    strategicContribution: {
      model: "dropdownMapper"
    },
    feasibility: {
      model: "dropdownMapper"
    },
    profitability: {
      model: "dropdownMapper"
    }
  }
};
