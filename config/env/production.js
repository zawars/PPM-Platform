/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 1337,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // },

  ssl: {
    key: require('fs').readFileSync(__dirname + '/ssl/key.pem'),
    cert: require('fs').readFileSync(__dirname + '/ssl/cert.pem'),
    // passphrase: "megowork"
  },
  mongodbServer: {
    adapter: 'sails-mongo',
    host: process.env.OPENSHIFT_MONGODB_DB_HOST || process.env.MONGO_HOST || 'mongo',
    port: process.env.OPENSHIFT_MONGODB_DB_PORT || process.env.MONGO_PORT || 27017,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME || process.env.MONGODB_USER || '', //optional => superOwner
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD || process.env.MONGODB_PASSWORD || '', //optional => superOwner
    database: 'pmt' //optional
  },

  hookTimeout: 60000,
  _hookTimeout: 60000,
  secret: 'e7523de3ded2590f8c6bd79ca7ece72a',

};
