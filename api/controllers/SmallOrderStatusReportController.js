/**
 * SmallOrderStatusReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getPreviousCurrentOrderReport: async (req, res) => {
    try {
      let smallOrder = await SmallOrder.findOne({
        id: req.params.id
      }).populateAll();
      let prevStatusReport = await SmallOrderStatusReport.findOne({
        id: req.params.prev
      }).populateAll();
      let currentStatusReport = await SmallOrderStatusReport.findOne({
        id: req.params.current
      }).populateAll();

      res.ok({
        smallOrder,
        prevStatusReport,
        currentStatusReport
      });
    } catch (error) {
    }
  },

  getOrderReport: async (req, res) => {
    try {
      let smallOrder = await SmallOrder.findOne({
        id: req.params.id
      }).populateAll();
      let statusReport = await SmallOrderStatusReport.findOne({
        id: req.params.reportId
      }).populateAll();

      res.ok({
        smallOrder,
        statusReport
      });
    } catch (error) {
    }
  },

  getStatusReportsByOrder: async (req, res) => {
    try {
      let smallOrderStatusReports = await SmallOrderStatusReport.find({
        smallOrder: req.params.id
      }).populateAll();

      res.ok(smallOrderStatusReports);
    } catch (err) {
      res.badRequest(err);
    };
  },

};
