const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  const accessToken = req.query.accessToken;
  const signature = req.query.signature;

  jwt.verify(accessToken, sails.config.secret, (err, authData) => {
    if (err) {
      return res.forbidden('You are not permitted to perform this action. Unauthorized, Token mismatch.');
    } else {
      if (authData.id == signature) {
        if (Date.now() >= authData.exp * 1000) {
          return res.forbidden('You are not permitted to perform this action. Unauthorized, Invalid request.');
        } else {
          return next();
        }
      } else {
        return res.forbidden('You are not permitted to perform this action. Unauthorized, Invalid request.');
      }
    }
  });

};
