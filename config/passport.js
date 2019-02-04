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
passport.use(new SamlStrategy({
  callbackUrl: config.callbackUrl,
  entryPoint: config.entryPointUrl,
  issuer: config.issuer,
  cert: fs.readFileSync('./api/policies/PPM.cer', 'utf-8'),
  signatureAlgorithm: 'sha256',
  logoutUrl: config.logoutUrl
}, function (profile, done) {
  return done(null, {
    id: profile['nameID'],
    email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
    firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
    lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
  });
}));
