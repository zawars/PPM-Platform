module.exports = function (req, res, next) {

  if (req.headers['authorization'] != undefined) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action. Unauthorized or Access Token missing.');
};
