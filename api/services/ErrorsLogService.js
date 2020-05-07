module.exports.logError = function (moduleName, errorDescription, api, req, userId) {
  if (typeof req == 'object') {
    const bearerToken = req.headers['authorization'].split(' ')[1];
    RedisService.get(bearerToken, (result) => {
      let userId = result.id;
      ErrorsLog.create({
        module: moduleName,
        errorDescription: errorDescription,
        api: api,
        user: userId
      }).then(createdError => {
      });
    })
  } else {
    ErrorsLog.create({
      module: moduleName,
      errorDescription: errorDescription,
      api: api,
      user: userId
    }).then(createdError => {
    });
  }
}