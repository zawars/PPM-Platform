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
  port: process.env.OPENSHIFT_NODEJS_PORT,
  host: process.env.OPENSHIFT_NODEJS_IP,
  // explicitHost: '109.203.126.97'
}
