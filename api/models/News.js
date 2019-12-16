/**
 * News.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    eventDate: {
      type: 'date',
    },
    description: {
      type: 'string'
    },
    isPast: {
      type: 'boolean',
      defaultsTo: false
    }
  },

};

