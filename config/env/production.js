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

  headers: ['content-type', 'authorization'],

  mongodbServer: {
    adapter: 'sails-mongo',
    host: '89.145.165.55',
    // host: 'localhost',
    port: 27017,
    user: 'admin', //optional => superOwner
    password: 'kitchlew2019$$', //optional => superOwner
    database: 'pmt'
  },

  hookTimeout: 40000,
  secret: 'e7523deP3ded2590Pf8c6bd79ca7Mece72a',

};
