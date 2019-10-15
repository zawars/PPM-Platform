/**
 * ProjectBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    deleteProjectBudget: async (req, res) => {
        try {
            let id = req.params.id;
            await ProjectBudgetCost.destroy({ 'project': id });
            console.log('Deleted Project Budget Cost');
            res.ok({message: 'Deleted Project Budget Cost'});
        } catch (e) {
            res.badRequest(e);
            console.log(e);
        }
    },

};

