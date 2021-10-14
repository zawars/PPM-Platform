/**
 * VacationModeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getLastActiveVacationRecord: async (req, res) => {
        let user = req.params.user;
        let lastVacationRecord = await VacationMode.findOne({ isVacationActive: true, user });
        res.ok(lastVacationRecord);
    }
};

