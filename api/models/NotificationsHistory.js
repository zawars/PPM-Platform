/**
 * NotificationsHistory.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    projectId: {
      type: 'string',
      model: 'projects',
      required: true
    },
    projectItem: {
      type: 'string',
      in: ['Project Outline', 'Project Order', 'Change Request', 'Closing Report'],
    },
    action: {
      type: 'string',
      in: ['approved', 'held', 'returned', 'rejected', 'comment'],
      required: true
    },
    actor: {
      type: 'string',
      model: 'user',
      required: true
    },
    isSeen: {
      type: 'boolean',
      defaultsTo: false
    },
  },

};

