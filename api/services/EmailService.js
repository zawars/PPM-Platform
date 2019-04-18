// var Email = require('machinepack-email');
// const sendmail = require('sendmail')({
//   smtpHost: 'mail.infomaniak.com',
//   smtpPort: 587
// });

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "mail.infomaniak.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'project.notification@bkw-oneview.com', // generated ethereal user
    pass: 'kitcHlew2277$$$' // generated ethereal password
  }
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

  // sendMail: (options, done) => {
  //   sendmail({
  //     from: 'project.notification@bkw-oneview.com',
  //     to: options.email,
  //     subject: options.subject,
  //     html: options.message + `<br><br>
  //     <div>Freundliche Grüsse / Meilleures salutations / Best Regards,<br><br>
  //     <strong>oneView</strong><br><br>

  //     Dies ist eine vom System generierte Mail. Bitte Antworten Sie nicht darauf. Bei Fragen oder Anliegen wenden Sie sich an den Applikationsverantwortlichen oder an den Service Desk der BKW.									
  //     This is an automatically generated message. Please do not reply to this message. For Questions please contact application responsible or BKW service desk.
  //     </div>`
  //   }, function (err, reply) {
  //     if (err) {
  //       return done(err);
  //     }
  //     return done();
  //   });
  // }

  sendMail: async (options, done) => {
    let info = await transporter.sendMail({
      from: 'project.notification@bkw-oneview.com',
      to: options.email,
      subject: options.subject,
      html: options.message + `<br><br>
      <div>Freundliche Grüsse / Meilleures salutations / Best Regards,<br><br>
      <strong>oneView</strong><br><br>
      
      Dies ist eine vom System generierte Mail. Bitte Antworten Sie nicht darauf. Bei Fragen oder Anliegen wenden Sie sich an den Applikationsverantwortlichen oder an den Service Desk der BKW.									
      This is an automatically generated message. Please do not reply to this message. For Questions please contact application responsible or BKW service desk.
      </div>`
    });

    console.log("Message sent: %s", info.messageId);
    return done();
  }
};
