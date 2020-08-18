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
  },

  getItemsNamesByBucket: async (req, res) => {
    try {
      let assignedBudgetItems = await ProjectBucketBudget.find({
        bucketId: req.params.bucketId
      }).populate('orderId', {
        select: ['name']
      }).populate('projectId', {
        select: ['projectName']
      });
      
      res.send(assignedBudgetItems);

    } catch (error) {
      ErrorsLogService.logError('ProjectBucketBudget', error.toString(), 'getItemsNamesByBucket', req);
    }
  },

  getItemsCountbyQuery: async (req, res) => {
    try {
      let count = await ProjectBucketBudget.count(req.body);
      res.send(count);
    } catch (error) {
      ErrorsLogService.logError('ProjectBucketBudget', error.toString(), 'getItemsCountbyQuery', req);
    }
  }

};
