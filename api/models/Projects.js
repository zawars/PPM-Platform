/**
 * Projects.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    projectName: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
    },
    outlineSubmitted: {
      type: 'boolean',
      defaults: false
    },
    outlineApproved: {
      type: 'boolean',
      defaults: false
    },
    orderSubmitted: {
      type: 'boolean',
      defaults: false
    },
    orderApproved: {
      type: 'boolean',
      defaults: false
    },
    user: {
      model: 'user',
    },
    projectOutline: {
      collection: 'projectOutline',
      via: 'projectId'
    },
    projectOrder: {
      collection: 'projectOrder',
      via: 'projectId'
    },
    onHold: {
      type: 'boolean',
      defaults: false
    },
    isFreezed: {
      type: 'boolean',
      defaults: false
    },
    isOrderFreezed: {
      type: 'boolean',
      defaults: false
    },
    uid: {
      type: 'integer',
      unique: true
    },
    docType: {
      type: 'string',
    },
    workflowStatus: {
      type: 'string',
    },
    version: {
      type: 'integer',
    },
    mode: {
      type: 'string'
    },
    projectReport: {
      model: 'reports'
    },
    history: {
      collection: 'history',
      via: 'project'
    },
    changeRequests: {
      collection: 'changeRequest',
      via: 'project'
    },
    changeRequestMade: {
      type: 'boolean',
      defaultsTo: false
    },
    closingReport: {
      collection: 'closingReport',
      via: 'project'
    },
    isCashedOut: {
      type: 'boolean',
      defaultsTo: false
    },
    isClosed: {
      type: 'boolean',
      defaultsTo: false
    },
    approvals: {
      collection: 'outlineApproval',
      via: 'project'
    },
    subPortfolio: {
      model: 'subPortfolio',
    },
  },

  beforeCreate: (values, cb) => {
    EmailService.counter++;
    values.uid = EmailService.counter;
    cb();
  }
};
