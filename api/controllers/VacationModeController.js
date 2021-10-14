/**
 * VacationModeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getLastActiveVacationRecord: async (req, res) => {
        let user = req.params.user;
        let todaysDate = new Date()
        let offset = todaysDate.getTimezoneOffset()
        todaysDate = new Date(todaysDate.getTime() - (offset * 60 * 1000))
        todaysDate = todaysDate.toISOString().split('T')[0]

        let lastVacationRecord = await VacationMode.findOne({ isVacationActive: true, user, endDate: { '>=': todaysDate }, startDate: { '<=': todaysDate } }).sort({ createdAt: -1 });
        res.ok(lastVacationRecord);
    }
};

