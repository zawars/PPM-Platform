var fs = require('fs');

module.exports = {
  // http: {
  //   serverOptions: {
  //     key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  //     cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
  //   }
  // },
  // ssl: {
  //   key: fs.readFileSync(__dirname + '/ssl/key.pem'),
  //     cert: fs.readFileSync(__dirname + '/ssl/cert.pem')
  // },
  // port: 1337,
  // port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  // ip: process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  ip: '0.0.0.0'
  // explicitHost: '109.203.126.97'
}
