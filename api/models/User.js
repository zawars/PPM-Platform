/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    azureId: {
      type: 'string',
      unique: true,
    },
    email: {
      type: 'string',
      unique: true
    },
    format: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    department: {
      type: 'string'
    },
    projects: {
      collection: 'projects',
      via: 'user'
    },
    teams: {
      collection: 'team',
      via: 'users'
    },
  }
};
