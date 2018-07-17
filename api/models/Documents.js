/**
 * Documents.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    report: {
      model: 'reports'
    },
    fileName: {
      type: 'string'
    },
    path: {
      type: 'string'
    },
    originalName: {
      type: 'string'
    },
    documentName: {
      type: 'string'
    },
    version: {
      type: 'integer'
    },
    type: {
      model: 'dropdownMapper'
    },
    status: {
      type: 'string'
    },
  }
};
