/**
 * GanttLogsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
    createGanttLogs: async (req, resp) => {
        let logsArray = req.body.logsArray;

        for (let i = 0; i < logsArray.length; i++) {
            await GanttLogs.create(logsArray[i]);
        }

        resp.ok({ result: "success" });
    }
    
};

