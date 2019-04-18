// isAuthorizedThirdParty.js

module.exports = async (req, res, next) => {
  try {
    const applicationId = req.headers['applicationid'];
    const secret = req.headers['secret'];

    if (applicationId && secret) {
      let data = await ThirdParties.findOne({
        applicationId: applicationId,
        secret: secret
      });

      if (data) {
        if (data.url == 'https://' + req.get('host') || data.url == 'http://' + req.get('host')) {
          return next();
        } else {
          return res.ok({
            message: 'Unauthorized, Application URL do not match.'
          });
        }
      } else {
        return res.ok({
          message: 'Unauthorized, You are not permitted to perform this action.'
        });
      }
    } else {
      return res.ok({
        message: 'Unauthorized, You are not permitted to perform this action. Missing headers.'
      });
    }
  } catch (error) {
    return res.ok({
      message: 'Unauthorized, Bad request.'
    });
  }
};
