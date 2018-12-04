/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  '/failure': {
    view: '404'
  },
  'GET /login': 'AuthController.login',
  'POST /saml/consume': 'AuthController.samlConsumeToken',
  'GET /syncUsers': 'UserController.syncUsers',

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

  'GET /projects/userProjects/:id': 'ProjectsController.userProjects',
  'GET /getUsersFromRoles/:role': 'UserController.getUsersFromRoles',
  'GET /getOutlinesByUser/:id': 'OutlineApprovalController.getOutlinesByUser',
  'GET /getUserByEmail/:email': 'UserController.getUserByEmail',
  'POST /sendEmail': 'UserController.sendEmail',
  'POST /upload': 'AttachmentController.uploadFile',
  'POST /deleteFile': 'AttachmentController.deleteFile',
  'POST /uploadDoc': 'DocumentsController.uploadFile',
  'GET /getReportsByUser/:id': 'ReportsController.getReportsByUser',
  'GET /getStatusReportsByProjectReport/:id': 'StatusReportsController.getStatusReportsByProjectReport',
  'GET /getOutlineApprovedProjects/:id': 'ProjectsController.getOutlineApprovedProjects',
  'GET /getSubmittedProjects/:id': 'ProjectsController.getSubmittedProjects',
  'GET /getGlobalConfigurations': 'ConfigurationsController.getGlobalConfigurations',
  'GET /getActivePrograms': 'ProgramController.getActivePrograms',
  'GET /getProgramsByUser/:id': 'ProgramController.getProgramsByUser',
  'GET /getTeamReportsByUser/:id': 'ReportsController.getTeamReportsByUser',
  'GET /getActivePortfolios': 'PortfolioController.getActivePortfolios',
  'GET /getStatusReportsByProgram/:id': 'ProgramStatusReports.getStatusReportsByProgram',
  'POST /updateApprovalSponsor': 'OutlineApprovalController.updateApprovalSponsor',
  'GET /getDocumentsByReport/:id': 'DocumentsController.getDocumentsByReport',
  'GET /getUserReport': 'ProjectsController.getUserReport',
  'GET /resetCount': 'ProjectsController.resetCount',
  'GET /resourceByReport/:id': 'ResourceController.resourceByReport',
  'POST /submitOutline': 'ProjectsController.submitOutline',
  'POST /submitOutlineUpdateCase/:id': 'ProjectsController.submitOutlineUpdateCase',
  'GET /dropdown': 'DropdownController.index',
  'GET /user/search/:query': 'UserController.search',
  'PUT /dropdown/:id': 'DropdownController.update',
  'GET /dropdownMapper/:id': 'DropdownMapperController.show',
  'DELETE /dropdownMapper/:id': 'DropdownMapperController.delete',
  'PUT /dropdownMapper/:id': 'DropdownMapperController.update',
  'GET /notification/lang/:id': 'NotificationsController.fetchLanguage',
  'GET /helpGuideMapper/:id': 'HelpGuideMapperController.show',
  'PUT /helpGuideMapper/:id': 'HelpGuideMapperController.update',
  'GET /helpGuide/getHelpGuideByFormName/:query': 'HelpGuideController.getHelpGuideByFormName',
  'GET /questions/getQuestionsByFormName/:query': 'QuestionsController.getQuestionsByFormName',
  'GET /questionsMapper/:id': 'QuestionsMapperController.show',
  'PUT /questionsMapper/:id': 'QuestionsMapperController.update',
  'GET /projects/getRecentActiveProjects': 'ProjectsController.getRecentActiveProjects',

};
