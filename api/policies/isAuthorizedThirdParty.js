// isAuthorizedThirdParty.js

module.exports = async (req, res, next) => {
  try {
    const applicationId = req.headers['applicationid'];
    const secret = req.headers['secret'];
    const authCode = req.headers['authcode'];

    if (applicationId && secret && authCode) {
      let data = await ThirdParties.findOne({
        applicationId: applicationId,
        secret: secret,
        authCode
      });

      if (data) {
        return next();
      } else {
        return res.ok({
          message: 'Unauthorized, You are not permitted to perform this action. Headers mismatch.'
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
