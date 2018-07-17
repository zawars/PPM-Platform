/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    projects: {
      collection: 'projects',
      via: 'user'
    },
    team: {
      model: 'team'
    }
  }
};
