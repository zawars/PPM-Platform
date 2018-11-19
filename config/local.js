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
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongodbServer: {
    adapter: 'sails-mongo',
    host: process.env.OPENSHIFT_MONGODB_DB_HOST || process.env.MONGO_HOST, //'localhost',
    port: process.env.OPENSHIFT_MONGODB_DB_PORT || process.env.MONGO_PORT, //27017,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME || process.env.MONGODB_USER || 'admin', //optional => superOwner
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD || process.env.MONGODB_PASSWORD || 'secret', //optional => superOwner
    database: 'pmt',
    url: process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  },
  // explicitHost: '109.203.126.97'
}
