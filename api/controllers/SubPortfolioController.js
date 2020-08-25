/**
 * SubPortfolioController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('subportfolioReports', async data => {
    try {
      let reports = await Reports.find({
        subPortfolio: data.id
      }).populateAll();

      socket.emit('subportfolioReports', reports);

    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'subportfolioReports', '', socket.user.id);
    }
  });

  socket.on('subportfolioOrders', async data => {
    try {
      let orders = await SmallOrder.find({
        subPortfolio: data.id
      }).populateAll();

      socket.emit('subportfolioOrders', orders);

    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'subportfolioOrders', '', socket.user.id);
    }
  });

  socket.on('subportfoliosByUserCount', async data => {
    try {
      let subportfoliosCount = await SubPortfolio.count({
        or: [{
          'subPortfolioManager.id': data.id
        }, {
          'additionalSubPortfolioManager.id': data.id
        }]
      });

      socket.emit('subportfoliosByUserCount', subportfoliosCount);

    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'subportfoliosByUserCount', '', socket.user.id);
    }
  });

  socket.on('subportfoliosByUser', async data => {
    try {
      let subportfolios = await SubPortfolio.find({
        or: [{
          'subPortfolioManager.id': data.id
        }, {
          'additionalSubPortfolioManager.id': data.id
        }]
      }).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populateAll();

      socket.emit('subportfoliosByUser', subportfolios);

    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'subportfoliosByUser', '', socket.user.id);
    }
  });

})

module.exports = {
  create: async (req, res) => {
    try {
      let createdSubportfolio = await SubPortfolio.create({
        name: req.body.name,
        portfolio: req.body.portfolio,
        subPortfolioManager: req.body.subPortfolioManager,
        additionalSubPortfolioManager: req.body.additionalSubPortfolioManager,
        statusReportReminder: req.body.statusReportReminder // statusReportReminder value is used to how many days after send email reminder those project managers whose do not create a status report according to current date  
      })
      let createdPortfolioBudgetYear = await PortfolioBudgetYear.create({
        year: new Date().getFullYear(),
        subPortfolio: createdSubportfolio.id
      })
      let response = await SubPortfolio.update({
        id: createdSubportfolio.id
      }).set({
        currentYear: createdPortfolioBudgetYear.id
      });

      await User.update({
        id: req.body.subPortfolioManager.id
      }).set({
        isSubportfolioManager: true
      });

      if (req.body.additionalSubPortfolioManager != undefined && req.body.subPortfolioManager.id != req.body.additionalSubPortfolioManager.id) {
        await User.update({
          id: req.body.additionalSubPortfolioManager.id
        }).set({
          isSubportfolioManager: true
        });
      }

      res.ok(response[0]);
    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'createSubportfolio', req);
    }
  },

  updateSubportfolio: async (req, res) => {
    try {
      let subportfolioId = req.params.id;
      let updatedSubportfolio = await SubPortfolio.update({
        id: subportfolioId
      }).set(req.body)

      if (req.body.subPortfolioManager != undefined) {
        await User.update({
          id: req.body.subPortfolioManager.id
        }).set({
          isSubportfolioManager: true
        });
      }

      if (req.body.additionalSubPortfolioManager != undefined && req.body.subPortfolioManager.id != req.body.additionalSubPortfolioManager.id) {
        await User.update({
          id: req.body.additionalSubPortfolioManager.id
        }).set({
          isSubportfolioManager: true
        });
      }

      res.send(updatedSubportfolio[0]);
    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'update', req);
    }
  },

  getSubportfolioProjects: async (req, res) => {
    try {
      let reports = await Reports.find({
        subPortfolio: req.params.id
      }, {
        fields: {
          project: 1
        }
      });

      let projectIds = [];

      if (reports.length > 0) {
        for (let i = 0; i < reports.length; i++) {
          projectIds.push(reports[i].project);
        }

        let projects = await Projects.find({
          id: projectIds
        }).populateAll();

        res.ok(projects);

      } else {
        res.ok([]);
      }
    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'getSubportfolioProjects', req);
    }
  },

  getUserSubportfolios: async (req, res) => {
    try {
      let limit = 0;
      if (req.param('limit')) {
        limit = req.param('limit');
      }

      let subportfolios = await SubPortfolio.find({
        or: [{
          'subPortfolioManager.id': req.params.id
        }, {
          'additionalSubPortfolioManager.id': req.params.id
        }]
      }).limit(limit).populateAll();

      res.ok(subportfolios);

    } catch (error) {
      ErrorsLogService.logError('Subportfolio', error.toString(), 'getUserSubportfolios', req);
    }
  }
};
