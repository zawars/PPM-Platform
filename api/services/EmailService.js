var Email = require('machinepack-email');
const sendmail = require('sendmail')({
  silent: false,
});

module.exports = {
  counter: 0,
  programCounter: 0,
  subProjectCounter: 0,

  // sendMail: (options, done) => {
  //   Email.send({
  //     auth: {
  //       user: "project.notifications@megowork.com", //"project.notifications@megowork.com" "testakkastech123@gmail.com"
  //       pass: "hotmail1234", //"akkastech" "hotmail1234"
  //     },
  //     service: 'mail3.gridhost',
  //     mail: {
  //       from: 'project.notifications@megowork.com',
  //       to: options.email,
  //       subject: options.subject,
  //       html: options.message
  //     },
  //     customTransport: 'nodemailer-smtp-transport',
  //   }).exec({
  //     error: function (err) {
  //       return done(err);
  //     },
  //     success: function () {
  //       return done();
  //     },
  //   });
  // },

  sendMail: (options, done) => {
    sendmail({
      from: 'project.notifications@megowork.com',
      to: options.email,
      subject: options.subject,
      html: options.message
    }, function (err, reply) {
      if (err) {
        return done(err);
      }
      return done();
    });
  }
};
