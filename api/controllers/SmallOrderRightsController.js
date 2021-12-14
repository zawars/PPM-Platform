/**
 * SmallOrderRightsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    smallOrderRights: async (req, res) => {
        try {
            const right = await SmallOrderRights.findOne({ smallOrder: req.params.smallOrderId, user: req.params.userId }).populateAll();
            res.ok(right);
        } catch (error) {
        }
    },

};

