/**
 * ProgramBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createProgramBudget: async (req, res) => {
    let programBudgetYear = await ProgramBudgetYear.findOne({
      year: new Date().getFullYear()
    });

    if (programBudgetYear == undefined) {
      programBudgetYear = await ProgramBudgetYear.create({
        year: new Date().getFullYear()
      });
    }

    let budget = [{
      costType: "External Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 0,
      group: "CAPEX",
    }, {
      costType: "Internal Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 1,
      group: "CAPEX",
    }, {
      costType: "External Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 2,
      group: "OPEX"
    }, {
      costType: "Internal Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 3,
      group: "OPEX"
    }, {
      costType: "Revenues",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 4,
      group: "Sonstiges",
    }, {
      costType: "Reserves",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      group: "Sonstiges",
      id: 5,
    }, {
      costType: "Total",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 6,
      group: "Sonstiges",
    }];

    let programBudgetCost = await ProgramBudgetCost.create({
      budget: budget,
      programBudgetYear: programBudgetYear.id,
      program: req.body.programId
    });

    res.ok(programBudgetCost);
  },

  createNewBudgetYear: async (req, res) => {
    let programBudgetYear = await ProgramBudgetYear.findOne({
      year: req.body.nextYear
    });

    if (programBudgetYear == undefined) {
      programBudgetYear = await ProgramBudgetYear.create({
        year: req.body.nextYear
      });
    }

    let budget = [{
      costType: "External Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 0,
      group: "CAPEX",
    }, {
      costType: "Internal Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 1,
      group: "CAPEX",
    }, {
      costType: "External Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 2,
      group: "OPEX"
    }, {
      costType: "Internal Costs",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 3,
      group: "OPEX"
    }, {
      costType: "Revenues",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 4,
      group: "Sonstiges",
    }, {
      costType: "Reserves",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      group: "Sonstiges",
      id: 5,
    }, {
      costType: "Total",
      yearlyBudget: '',
      thereofIT: '',
      davonGEICT: '',
      id: 6,
      group: "Sonstiges",
    }];

    let createdBudgetCost = await ProgramBudgetCost.create({
      budget: budget,
      programBudgetYear: programBudgetYear.id,
      program: req.body.programId
    });

    let programBudgetCost = await ProgramBudgetCost.findOne({
      id: createdBudgetCost.id
    }).populateAll();

    res.ok({
      message: "Year Added",
      programBudgetCost: programBudgetCost
    });
  },

  getBudgetCostByProgram: async (req, res) => {
    let programBudgetCost = await ProgramBudgetCost.find({
      program: req.params.id
    }).populateAll();

    res.ok(programBudgetCost);
  }
};
