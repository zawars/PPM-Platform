/**
 * SmallOrderStatusReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getPreviousCurrentOrderReport: async (req, res) => {
    try {
      let smallOrder = await SmallOrder.findOne({ id: req.params.id }).populateAll();
      let prevStatusReport = await SmallOrderStatusReport.findOne({ id: req.params.prev }).populateAll();
      let currentStatusReport = await SmallOrderStatusReport.findOne({ id: req.params.current }).populateAll();

      res.ok({smallOrder, prevStatusReport, currentStatusReport});
    } catch (error) {
      ErrorsLogService.logError('Small Order Status Report', `id: ${req.params.id}, ` + error.toString(), 'getPreviousCurrentOrderReport', req);
    }
  },

  getOrderReport: async (req, res) => {
    try {
      let smallOrder = await SmallOrder.findOne({ id: req.params.id }).populateAll();
      let statusReport = await SmallOrderStatusReport.findOne({ id: req.params.reportId }).populateAll();

      res.ok({smallOrder, statusReport});
    } catch (error) {
      ErrorsLogService.logError('Small Order Status Report', `id: ${req.params.id}, ` + error.toString(), 'getOrderReport', req);
    }
  },

  getStatusReportsByOrder: (req, res) => {
    SmallOrderStatusReport.find({
      smallOrder: req.params.id
    }).then(reports => {
      res.ok(reports);
    }).catch(err => {
      ErrorsLogService.logError('Small Order Status Reports', `id: ${req.params.id}, ` + err.toString(), 'getStatusReportsByOrder', req);
      res.badRequest(err);
    });
  },

};

