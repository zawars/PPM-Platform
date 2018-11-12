/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  // mongodbServer: {
  //   adapter: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: 'root', //optional => superOwner
  //   password: '', //optional => superOwner
  //   database: 'pmt' //optional
  // },
  mongodbServer: {
    adapter: 'sails-mongo',
    host: process.env.OPENSHIFT_MONGODB_DB_HOST, //'localhost',
    port: process.env.OPENSHIFT_MONGODB_DB_PORT, //27017,
    user: process.env.OPENSHIFT_MONGODB_DB_USERNAME || '', //optional => superOwner
    password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD || '', //optional => superOwner
    database: 'pmt' //optional
  },

};
