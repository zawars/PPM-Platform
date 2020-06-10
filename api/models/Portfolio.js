/**
 * Portfolio.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
    },
    department: {
      type: 'string',
    },
    businessArea: {
      model: 'dropdownMapper',
    },
    responsible: {
      type: 'json',
    },
    status: {
      type: 'string',
    },
    // reports: {
    //   collection: 'Reports',
    //   via: 'portfolio'
    // },
    subPortfolio: {
      collection: 'subPortfolio',
      via: 'portfolio'
    },
  }
};
