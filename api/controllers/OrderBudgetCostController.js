/**
 * OrderBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ObjectId = require('mongodb').ObjectID;

module.exports = {
  createOrderBudgetCost: async (req, res) => {
    let portfolioBudgetYear = await PortfolioBudgetYear.findOne({
      subPortfolio: req.body.subPortfolioId,
      year: `${req.body.year}`
    });

    if (portfolioBudgetYear == undefined) {
      portfolioBudgetYear = await PortfolioBudgetYear.create({
        year: req.body.year,
        subPortfolio: req.body.subPortfolioId
      });
    }

    let budget = [{
      costType: "External Costs",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 0,
      group: "CAPEX",
    }, {
      costType: "Internal Costs",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 1,
      group: "CAPEX",
    }, {
      costType: "External Costs",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 2,
      group: "OPEX"
    }, {
      costType: "Internal Costs",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 3,
      group: "OPEX"
    }, {
      costType: "Revenues",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 4,
      group: "Sonstiges",
    }, {
      costType: "Reserves",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      group: "Sonstiges",
      id: 5,
    }, {
      costType: "Total",
      budget: '',
      thereofIT: '',
      yearlyForecast: '',
      thereofITForecast: '',
      remainingProjectBudget: '',
      id: 6,
      group: "Sonstiges",
    }];

    await OrderBudgetCost.create({
      budget: budget,
      portfolioBudgetYear: portfolioBudgetYear.id,
      order: req.body.orderId
    });

    res.ok({
      result: "Success"
    });
  },

  budgetsByYear: async (req, res) => {
    OrderBudgetCost.native(async function (err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([{
          $match: {
            portfolioBudgetYear: ObjectId(req.params.id)
          }
        },
        {
          $lookup: {
            from: "projectbucketbudget",
            let: {
              portfolioBudgetYear: '$portfolioBudgetYear',
              orderId: "$order"
            },
            pipeline: [{
                $match: {
                  $expr: {
                    $and: [{
                        $eq: ["$portfolioBudgetYear", "$$portfolioBudgetYear"]
                      },
                      {
                        $eq: ["$orderId", "$$orderId"]
                      }
                    ]
                  }
                },
              },
              {
                $group: {
                  _id: null,
                  count: {
                    $sum: 1
                  }
                }
              },
              {
                $project: {
                  _id: 0
                }
              }
            ],
            as: "assignmentsCount"
          },
        },
        {
          $unwind: {
            path: '$assignmentsCount',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "smallorder",
            localField: 'order',
            foreignField: '_id',
            as: "order"
          }
        },
        {
          $unwind: '$order'
        }
      ]).toArray(function (err, orderBudgetCosts = []) {
        if (err) return;
        orderBudgetCosts.forEach(result => {
          if (result.order.costTypeTable) {
            for (let i = 0; i < 7; i++) {
              result.budget[i].remainingProjectBudget = parseInt(result.order.costTypeTable[i].currentBudget || 0) - parseInt(result.order.costTypeTable[i].actualCost || 0);
            }
          }
        });
        res.ok(orderBudgetCosts);
      });
    });
  },

  updateMultipleOrdersBudget: (req, res) => {
    try {
      let ordersBudget = req.body.ordersBudget;

      ordersBudget.forEach(async (order, index) => {
        let result = await OrderBudgetCost.update({
            id: order.id
          })
          .set({
            budget: order.budget
          })

        if (index == ordersBudget.length - 1) {
          res.ok(result);
        }
      });
    } catch (error) {
    }
  },

  getOrderBudget: async (req, res) => {
    try {
      let id = req.params.id;
      let results = await OrderBudgetCost.find({
        order: id
      }).populateAll();

      res.ok(results);
    } catch (e) {
      res.badRequest(e);
    }
  },


};
