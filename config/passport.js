// const passport = require('passport');
// var SamlStrategy = require('passport-saml').Strategy;

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findOne({ id: id }, function (err, user) {
//     done(err, user);
//   });
// });

// passport.use(new SamlStrategy(
//   {
//     callbackUrl: 'https://109.203.126.97:1337/saml/consume',
//     entryPoint: 'https://login.microsoftonline.com/eb4f0621-3972-4ef0-9843-f918e2abde82/saml2',
//     issuer: 'passport-saml',
//     authnRequestBinding: 'HTTP-POST'
//   },
//   function (profile, done) {
//     console.log(profile);
//     done();
//   })
// );
