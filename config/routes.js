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
  'GET /authenticate/:id': 'AuthController.getTokenOnLogin',
  'GET /logout': 'AuthController.logout',
  'POST /saml/consume': 'AuthController.samlConsumeToken',
  'POST /saml/logout': 'AuthController.samlLogout',
  'GET /syncUsers': 'UserController.syncUsers',

  'GET /user/login/external/:email': 'AuthController.externalLogin',
  'POST /user/verify/external': 'AuthController.verifyTokenExternal',

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
  'POST /notifyAdmins': 'UserController.notifyAdminsbyEmail',
  'POST /upload': 'AttachmentController.uploadFile',
  'POST /deleteFile': 'AttachmentController.deleteFile',
  'POST /uploadDoc': 'DocumentsController.uploadFile',
  'GET /getReportsByUser/:id': 'ReportsController.getReportsByUser',
  'GET /getStatusReportsByProjectReport/:id': 'StatusReportsController.getStatusReportsByProjectReport',
  'GET /getOutlineApprovedProjects/:id': 'ProjectsController.getOutlineApprovedProjects',
  'GET /getSubmittedProjects': 'ProjectsController.getSubmittedProjects',
  'GET /getGlobalConfigurations': 'ConfigurationsController.getGlobalConfigurations',
  'GET /getActivePrograms': 'ProgramController.getActivePrograms',
  'GET /getProgramsByUser/:id': 'ProgramController.getProgramsByUser',
  'GET /getTeamReportsByUser/:id': 'ReportsController.getTeamReportsByUser',
  'GET /getActivePortfolios': 'PortfolioController.getActivePortfolios',
  'GET /getStatusReportsByProgram/:id': 'ProgramStatusReports.getStatusReportsByProgram',
  'POST /updateApprovalOwner': 'OutlineApprovalController.updateApprovalOwner',
  'GET /getDocumentsByReport/:id': 'DocumentsController.getDocumentsByReport',
  'GET /getUserReport': 'ProjectsController.getUserReport',
  'GET /resetCount': 'ProjectsController.resetCount',
  'GET /resourceByReport/:id': 'ResourceController.resourceByReport',
  'POST /submitOutline': 'ProjectsController.submitOutline',
  'POST /submitOutlineUpdateCase/:id': 'ProjectsController.submitOutlineUpdateCase',
  'GET /user/search/:query': 'UserController.search',
  'GET /dropdown': 'DropdownController.index',
  'PUT /dropdown/:id': 'DropdownController.update',
  'POST /dropdown': 'DropdownController.create',
  'POST /dropdownMapper/position': 'DropdownMapperController.positionSort',
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
  'GET /projects/closed': 'ProjectsController.getClosedProjects',
  'GET /projects/activeProjects/:search': 'ProjectsController.activeProjectsSearch',
  'POST /updatePreviousApproval': 'OutlineApprovalController.updatePreviousApproval',
  'POST /thirdParties/register': 'ThirdPartiesController.register',
  'GET /projects/search/:query': 'ProjectsController.search',

  'GET /api/v1/agilePlanning': 'ThirdPartiesController.agilePlanning',

  'GET /reports/search/:query': 'ReportsController.searchProjectsReports',
  'POST /budgetImport': 'ReportsController.budgetImport',
  'GET /reports/budgetSwitch': 'ReportsController.budgetSwitch',
  'POST /reports/portfolio': 'ReportsController.projectsByPortfolio',
  'GET /reports/portfolio/:id/:subPortfolio': 'ReportsController.getProjectsBySubPortfolio',
  'PUT /reports/:id': 'ReportsController.update',

  // Team Api
  'GET /project/team/:id': 'TeamController.projectTeam',
  'GET /user/team/project/:id': 'TeamController.userTeamProjects',

  // Rights Api
  'GET /getRight/:projectId/:userId': 'RightsController.projectRights',

  // ProjectBudgetCost Api
  'DELETE /projectBudgetCost/project/:id': 'ProjectBudgetCostController.deleteProjectBudget',
  'GET /projectBudgetCost/project/:id': 'ProjectBudgetCostController.getProjectBudget',
  'GET /projectBudgetCost/year/:id': 'ProjectBudgetCostController.budgetsByYear',
  'POST /createProjectBudgetCostbyYear': 'ProjectBudgetCostController.createBudgetByYear',
  'POST /updateMultipleProjectsBudget': 'ProjectBudgetCostController.updateMultipleProjectsBudget',

  //News
  'GET /news': 'NewsController.index',
  'POST /news': 'NewsController.create',

  //Notifications
  'GET /getNotifications': 'NotificationsHistoryController.getAllNotifications',
  'GET /seenNotifications': 'NotificationsHistoryController.seenNotifications',

  //Dashboard
  'GET /getDashboardData': 'DashboardController.getDashboard',

  //Subportfolio budget
  'GET /portfolioBudgetYear/:id': 'PortfolioBudgetYearController.getBudgetYears',
  'POST /portfolioBudgetYear/fixYearlyBudget': 'PortfolioBudgetYearController.fixYearlyBudget',
  'POST /portfolioBudgetYear/fixAllYearlyBudget': 'PortfolioBudgetYearController.fixAllYearlyBudget',

  //Subportfolio status report
  'GET /subportfolio/statusReports/:subportfolioId': 'SubportfolioStatusReportController.statusReportsbySubportfolio',

  //Subportfolio
  'POST /subPortfolio': 'SubPortfolioController.create',
  'GET /subPortfolio/:id/projects': 'SubPortfolioController.getSubportfolioProjects',
  'GET /subPortfolio/user/:id': 'SubPortfolioController.getUserSubportfolios',

  //ProjectOutline
  'PUT /project/outline': 'ProjectOutlineController.updateProjectOutline',

  //ProjectOrder
  'PUT /project/order': 'ProjectOrderController.updateProjectOrder',
  'POST /project/order/approval': 'ProjectOrderController.submitOrder',
  'PUT /project/order/approval': 'ProjectOrderController.submitOrderUpdateCase',

  //ChangeRequest
  'POST /project/changeRequest/approval': 'ChangeRequestController.submitChangeRequest',
  'PUT /project/changeRequest/approval': 'ChangeRequestController.submitChangeRequestUpdateCase',

  //ClosingReport
  'POST /project/closingReport/approval': 'ClosingReportController.submitClosingReport',
  'PUT /project/closingReport/approval': 'ClosingReportController.submitClosingReportUpdateCase',

  // Translation Api
  'GET /translation': 'TranslationController.index',
  'POST /translation': 'TranslationController.create',
  'PUT /translation': 'TranslationController.update',
  'DELETE /translation/:en': 'TranslationController.delete',

  // SmallOrder Api
  'GET /smallOrder': 'SmallOrderController.getSmallOrders',
  'GET /smallOrder/user/:id': 'SmallOrderController.getSmallOrdersByUser',
  'GET /smallOrder/sponsor/:id': 'SmallOrderController.getSmallOrdersBySponsor',

  // SmallOrderStatusReport Api
  'GET /smallOrder/statusReport/:id/:prev/:current': 'SmallOrderStatusReportController.getPreviousCurrentOrderReport',
  'GET /smallOrder/statusReport/:id/:reportId': 'SmallOrderStatusReportController.getOrderReport',
  'GET /getStatusReportsByOrder/:id': 'SmallOrderStatusReportController.getStatusReportsByOrder',

  //Program Budget
  'POST /createProgramBudget': 'ProgramBudgetCostController.createProgramBudget',
  'POST /createNewProgramBudgetYear': 'ProgramBudgetCostController.createNewBudgetYear',
  'GET /getBudgetCostByProgram/:id': 'ProgramBudgetCostController.getBudgetCostByProgram',

  //Small Order BudgetCost
  'POST /createOrderBudget': 'OrderBudgetCostController.createOrderBudgetCost',
  'GET /orderBudgetCost/year/:id': 'OrderBudgetCostController.budgetsByYear',
  'POST /updateMultipleOrdersBudget': 'OrderBudgetCostController.updateMultipleOrdersBudget',
  'GET /orderBudgetCost/order/:id': 'OrderBudgetCostController.getOrderBudget'

};
