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

module.exports.nextLetter = function (s) {
  return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function (a) {
    var c = a.charCodeAt(0);
    switch (c) {
      case 90: return 'A';
      case 122: return 'a';
      default: return String.fromCharCode(++c);
    }
  });
}