/**
 * Passport-LDAP
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

const passport = require('passport');
let SamlStrategy = require('passport-saml').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const fs = require('fs');
let users = [];

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
passport.use(new SamlStrategy({
    callbackUrl: config.callbackUrl,
    entryPoint: config.entryPointUrl,
    issuer: 'MYPPM',
    cert: fs.readFileSync('./api/policies/PPM.cer', 'utf-8'),
    signatureAlgorithm: 'sha256'
  },
  function (profile, done) {
    return done(null, {
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    });
  }));

// var OPTS = {
//   identityMetadata: 'https://login.microsoftonline.com/luftmatrazetoutlook.onmicrosoft.com/v2.0/.well-known/openid-configuration',
//   clientID: '42b8cc8e-5a2b-4455-828b-3a8f59aed428',
//   responseType: 'id_token',
//   responseMode: 'form_post',
//   redirectUrl: 'https://euk-88794.eukservers.com/#/login',
//   clientSecret: 'Q4YvrZxZgynFcUHwbRSRIQnEMx9HHpE+H+6bYx2m6lI=',
//   validateIssuer: false,
//   passReqToCallback: false,
//   loggingLevel: 'info',
// };

// passport.use(new OIDCStrategy(OPTS,
//   function (iss, sub, profile, accessToken, refreshToken, done) {
//     if (!profile.oid) {
//       return done(new Error("No oid found"), null);
//     }
//     // asynchronous verification, for effect...
//     process.nextTick(function () {
//       findByOid(profile.oid, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           // "Auto-registration"
//           users.push(profile);
//           return done(null, profile);
//         }
//         return done(null, user);
//       });
//     });
//   }
// ));



module.exports = function (req, res, next) {
  // console.log(req.allParams());

  // passport.authenticate('azuread-openidconnect', {
  // passport.authenticate('azuread-openidconnect', {
  //   failureRedirect: '/'
  // }, function (err, user, info) {
  //   // if (err || !user) {
  //   //   return res.forbidden('You are not permitted to perform this action.');
  //   // }
  //   // User.findOne({
  //   //   username: username
  //   // }).exec(function (err, row) {
  //   //   if (row) {
  //   //     // session.init(req, row);
  //   //     return next();
  //   //   }
  //   // });
  //   console.log(user);
  //   console.log('#######################');
  //   console.log(info);
  // })(req, res)

  // return res.forbidden('You are not permitted to perform this action.');

  passport.authenticate('saml', {
      successRedirect: '/',
      failureRedirect: '/failure',
      failureFlash: true
    },
    function (req, res) {
      return next();
    })(req, res);

};
