/**
 * OutlineApproval.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    status: {
      type: 'string'
    },
    projectStatus: {
      type: 'string'
    },
    overallStatus: {
      type: 'string'
    },
    projectOutline: {
      type: 'json'
    },
    projectOrder: {
      type: 'json'
    },
    assignedTo: {
      model: 'user'
    },
    project: {
      model: 'projects'
    },
    docType: {
      type: 'string',
      required: true
    },
    sentTo: {
      type: 'string'
    },
    isFreezed: {
      type: 'boolean'
    },
    version: {
      type: 'integer'
    },
    uid: {
      type: 'integer'
    }
  },

  // afterCreate: function (values, cb) {
  //   User.findOne({
  //     id: values.assignedTo
  //   }).then(user => {
  //     EmailService.sendMail({
  //       email: user.email,
  //       message: 'The following Project Approval request is waiting for your response. <br><br><br>  Please follow the link to reply: <a href="http://euk-84842.eukservers.com">http://euk-84842.eukservers.com</a> <br><br><br><br> Thank You <br><br> MEGOWORK PPM <br><br> Note: This is an automatically generated message. Please do not reply to this message.',
  //       subject: 'Project Outline Approval'
  //     }, (err) => {
  //       if (err)
  //         console.log(err);
  //     });
  //     cb();
  //   });
  // }
};
