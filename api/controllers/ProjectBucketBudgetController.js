/**
 * ProjectBucketBudgetController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  findProjectBucketAssignedBudget: async (req, res) => {
    try {
      let assignedBudget = await ProjectBucketBudget.find(req.body);
      res.send(assignedBudget);

    } catch (error) {
      ErrorsLogService.logError('ProjectBucketBudget', error.toString(), 'findProjectBucketAssignedBudget', req);
    }
  }

};
