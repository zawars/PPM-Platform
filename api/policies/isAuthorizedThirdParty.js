// isAuthorizedThirdParty.js

module.exports = async (req, res, next) => {
  try {
    const applicationId = req.headers['applicationid'];
    const secret = req.headers['secret'];

    let data = await ThirdParties.findOne({
      applicationId: applicationId,
      secret: secret
    });

    if (data) {
      if (data.url == 'https://' + req.get('host')) {
        return next();
      } else {
        return res.forbidden('Unauthorized, Application URL do not match.');
      }
    } else {
      return res.forbidden('Unauthorized, You are not permitted to perform this action.');
    }
  } catch (error) {
    return res.forbidden('Unauthorized, You are not permitted to perform this action. Missing headers.');
  }
};
