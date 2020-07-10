/**
 * SubPortfolio.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: 'string',
    },
    currentYear: {
      type: 'string',
    },
    documentLink: {
      type: 'string',
    },
    statusReportReminder: {
      type: 'json'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    portfolio: {
      model: 'portfolio',
    },
    // subPortfolioManager: {
    //   model: 'user',
    // },
    additionalSubPortfolioManager: {
      type: 'json',
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    costYears: {
      collection: 'PortfolioBudgetYear',
      via: 'subPortfolio'
    },
    projects: {
      collection: 'projects',
      via: 'subPortfolio'
    },
    reports: {
      collection: 'reports',
      via: 'subPortfolio'
    },
    smallOrders: {
      collection: 'SmallOrder',
      via: 'subPortfolio'
    },

  },

};
