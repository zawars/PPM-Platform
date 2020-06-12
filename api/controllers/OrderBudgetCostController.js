/**
 * OrderBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
    let orderBudgetCosts = await OrderBudgetCost.find({
      portfolioBudgetYear: req.params.id
    }).populateAll();

    orderBudgetCosts.forEach(result => {
      if (result.order.costTypeTable) {
        for (let i = 0; i < 7; i++) {
          result.budget[i].remainingProjectBudget = parseInt(result.order.costTypeTable[i].currentBudget || 0) - parseInt(result.order.costTypeTable[i].actualCost || 0);
        }
      }
    });

    res.ok(orderBudgetCosts);
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
      ErrorsLogService.logError('Order Budget Cost', error.toString(), 'updateMultipleOrdersBudget', req);
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
      ErrorsLogService.logError('Order Budget Cost', `id: ${req.params.id}, ` + e.toString(), 'getOrderBudget', req);
      res.badRequest(e);
    }
  },


};
