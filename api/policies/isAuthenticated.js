const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller

  const bearerToken = req.headers['authorization'].split(' ')[1];

  jwt.verify(bearerToken, sails.config.secret, (err, authData) => {
    if (err) {
      return res.forbidden('You are not permitted to perform this action. Unauthorized, Token mismatch.');
    } else {
      RedisService.get(bearerToken, (result) => {
        if (result != undefined) {
          if (authData.user.azureId == result.azureId) {
            return next();
          } else {
            return res.forbidden('You are not permitted to perform this action. Unauthorized, Invalid request.');
          }
        } else {
          return res.forbidden('You are not permitted to perform this action. Unauthorized, Invalid request.');
        }
      });
    }
  });

};
