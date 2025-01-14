/**
 * GanttMilestonesReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getGanttMilestoneReportByProject: async (req, res) => {
        let ganttMilestoneReport = await GanttMilestonesReport.find({ projectId: req.params.id });
        res.ok(ganttMilestoneReport);
    }

};

