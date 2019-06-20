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
const fs = require('fs');

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let strategy = new SamlStrategy({
  entryPoint: config.entryPointUrl,
  callbackUrl: config.callbackUrl,
  issuer: config.issuer,
  cert: fs.readFileSync('./api/policies/PPM.cer', 'utf-8'),
  signatureAlgorithm: 'sha256',
  logoutUrl: config.logoutUrl,
  logoutCallbackUrl: config.logoutCallbackUrl,
}, function (profile, done) {
  console.log('profile ', profile)
  let user = {
    nameID: profile.nameID,
    nameIDFormat: profile.nameIDFormat,
    sessionIndex: profile.sessionIndex,
    email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
    firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
    lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
  };
  user.email = profile.Email;
  user.saml = {};
  user.saml.nameID = profile.nameID;
  user.saml.nameIDFormat = profile.nameIDFormat;
  return done(null, user);
});
EmailService.samlStrategy = strategy;
passport.use(strategy);

module.exports = function (req, res, next) {
  req.query.RelayState = req.query.redirectTo;

  passport.authenticate('saml', {
    // successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
  }, function (req, res) {
    return next();
  })(req, res);

};
