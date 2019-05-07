/**
 * ReportsController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getReportsByUser: (req, res) => {
    Reports.find({
      user: req.params.id
    }).populate('user').then(reports => {
      res.ok(reports);
    });
  },

  getTeamReportsByUser: (req, res) => {
    Reports.find().populate('user').populate('project').populate('team').then(reports => {
      // res.ok(reports);
      let resultReports = [];
      reports.forEach((report, index) => {
        if (report.team) {
          let arr = report.team.forEach((obj) => {
            if (obj.name.id == req.params.id) {
              resultReports.push(report);
            }
          });
        }
      });
      res.ok(resultReports);
    });
  },

  budgetImport: async (req, res) => {
    let data = req.body;
    const fs = require('fs');
    const XLSX = require('xlsx');

    let workbook = XLSX.readFile(data.path);
    let sheet_name_list = workbook.SheetNames;
    let currentYearBudgetResult = XLSX.utils.sheet_to_json(workbook.Sheets['Project Budget Current Year']);
    let result = XLSX.utils.sheet_to_json(workbook.Sheets['Project Budget Next Year']);
    let actualCostTableResult = XLSX.utils.sheet_to_json(workbook.Sheets['Project Actual Budget']);
    let currentYearSubPortfolioTableResult = XLSX.utils.sheet_to_json(workbook.Sheets['Sub-Port Budget Current Year']);
    let nextYearSubPortfolioTableResult = XLSX.utils.sheet_to_json(workbook.Sheets[`Sub-Port Budget Next Year`]);

    let budgetPlanningTable2;
    for (let i = 0; i < result.length; i += 7) {
      if (result[i]) {
        // Project Next Year Budget
        let reportObj1 = await Reports.findOne({ uid: result[i].projectId });
        budgetPlanningTable2 = reportObj1.budgetPlanningTable2;

        if (budgetPlanningTable2) {
          budgetPlanningTable2.forEach((val, idx) => {
            val.budget = result[i + idx].budget;
            val.thereofICT = result[i + idx].thereofICT
          });
        } else {
          budgetPlanningTable2 = [];
          for (let j = i; j < i + 7; j++) {
            budgetPlanningTable2.push({
              costType: result[j].costType,
              budget: result[j].budget,
              id: result[j].id,
              group: result[j].group,
              thereofICT: result[j].thereofICT,
            });
          }
        }

        await Reports.update({
          uid: result[i].projectId
        }).set({ budgetPlanningTable2 });
        budgetPlanningTable2 = [];
      }
    }

    // Project Current Year Budget
    for (let i = 0; i <= currentYearBudgetResult.length; i += 7) {
      if (currentYearBudgetResult[i]) {
        let reportObj2 = await Reports.findOne({ uid: currentYearBudgetResult[i].projectId });
        let budgetPlanningTable1 = reportObj2.budgetPlanningTable1;

        if (budgetPlanningTable1) {
          budgetPlanningTable1.forEach((val, idx) => {
            val.actualCost = currentYearBudgetResult[i + idx].actualCost;
          });
        }

        await Reports.update({
          uid: currentYearBudgetResult[i].projectId
        }).set({ budgetPlanningTable1 });
      }
    }

    // Project Actual Budget
    for (let i = 0; i <= actualCostTableResult.length; i += 7) {
      if (actualCostTableResult[i]) {
        let reportObj3 = await Reports.findOne({ uid: actualCostTableResult[i].projectId });
        let actualCostTable = reportObj3.actualCostTable;

        if (actualCostTable) {
          actualCostTable.forEach((val, idx) => {
            val.actualCost = actualCostTableResult[i + idx].actualCost;
          });
        }

        await Reports.update({
          uid: actualCostTableResult[i].projectId
        }).set({ actualCostTable });
      }
    }

    // Sub-Portfolio Current Year Budget
    for (let i = 0; i <= currentYearSubPortfolioTableResult.length; i += 7) {
      if (currentYearSubPortfolioTableResult[i]) {
        let portfolioObj = await Portfolio.findOne({ id: currentYearSubPortfolioTableResult[i].portfolioId });
        let subPortfolioBudgetingList = portfolioObj.subPortfolioBudgetingList;

        let length = subPortfolioBudgetingList.length;
        if (subPortfolioBudgetingList) {
          for (let j = 0; j < length; j++) {
            subPortfolioBudgetingList[j].pspCurrentYear = currentYearSubPortfolioTableResult[i].pspCurrentYear;
            if (subPortfolioBudgetingList[j].subPortfolioBudgetCurrentYear) {
              subPortfolioBudgetingList[j].subPortfolioBudgetCurrentYear.forEach((obj, index) => {
                obj.budget = currentYearSubPortfolioTableResult[i + index].budget;
                obj.thereofICT = currentYearSubPortfolioTableResult[i + index].thereofICT;
              });
            }

            if (j < length - 1) { // In order to loop for all sub portfolios and also to skip the portion of their data in excel
              i += 7;
            }
          }
        }

        await Portfolio.update({ id: currentYearSubPortfolioTableResult[i].portfolioId }).set({ subPortfolioBudgetingList });
      }
    }

    // Sub-Portfolio Next Year Budget
    let subPortfolioBudgetingList;
    for (let i = 0; i <= nextYearSubPortfolioTableResult.length; i += 7) {
      if (nextYearSubPortfolioTableResult[i]) {
        let portfolioObj = await Portfolio.findOne({ id: nextYearSubPortfolioTableResult[i].portfolioId });
        subPortfolioBudgetingList = portfolioObj.subPortfolioBudgetingList;

        let length = subPortfolioBudgetingList.length;
        if (subPortfolioBudgetingList) {
          for (let j = 0; j < length; j++) {
            subPortfolioBudgetingList[j].pspNextYear = nextYearSubPortfolioTableResult[i].pspNextYear;
            if (subPortfolioBudgetingList[j].subPortfolioBudgetNextYear) {
              subPortfolioBudgetingList[j].subPortfolioBudgetNextYear.forEach((obj, index) => {
                obj.budget = nextYearSubPortfolioTableResult[i + index].budget;
                obj.thereofICT = nextYearSubPortfolioTableResult[i + index].thereofICT;
              });
            }

            if (j < length - 1) { // In order to loop for all sub portfolios and also to skip the portion of their data in excel
              i += 7;
            }
          }
        }

        await Portfolio.update({ id: nextYearSubPortfolioTableResult[i].portfolioId }).set({ subPortfolioBudgetingList });
        subPortfolioBudgetingList = [];
      }
    }

    fs.unlink(data.path, function (err) {
      if (err) return console.log(err); // handle error as you wish
      res.ok({
        message: 'Data Imported successfully.'
      });
    });
  },

  budgetSwitch: async (req, res) => {
    let reports = await Reports.find({
      status: 'Active'
    });

    reports.map(async report => {
      await Reports.update({
        status: 'Active',
        id: report.id
      }).set({
        budgetPlanningTable1: report.budgetPlanningTable2,
        budgetPlanningTable2: undefined
      });
    });

    let portfolios = await Portfolio.find({ status: 'Active' });
    portfolios.map(async portfolio => {
      if (portfolio.portfolioBudgetingList) {
        if (portfolio.portfolioBudgetingList.portfolioBudgetCurrentYear) {
          portfolio.portfolioBudgetingList.portfolioBudgetCurrentYear.forEach((val, idx) => {
            val.budget = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].budget;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].budget = '';
            val.assigned = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].assigned;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].assigned = '';
            val.remaining = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remaining;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remaining = '';
            val.remainingPercent = portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remainingPercent;
            portfolio.portfolioBudgetingList.portfolioBudgetNextYear[idx].remainingPercent = '';
          });
        }
      }

      if (portfolio.subPortfolioBudgetingList) {
        portfolio.subPortfolioBudgetingList.forEach(budgetObj => {
          budgetObj.pspCurrentYear = budgetObj.pspNextYear;
          budgetObj.pspNextYear = '';
          budgetObj.subPortfolioBudgetCurrentYear.forEach((val, idx) => {
            if (budgetObj.subPortfolioBudgetNextYear) {
              val.budget = budgetObj.subPortfolioBudgetNextYear[idx].budget;
              budgetObj.subPortfolioBudgetNextYear[idx].budget = '';
              val.assigned = budgetObj.subPortfolioBudgetNextYear[idx].assigned;
              budgetObj.subPortfolioBudgetNextYear[idx].assigned = '';
              val.remaining = budgetObj.subPortfolioBudgetNextYear[idx].remaining;
              budgetObj.subPortfolioBudgetNextYear[idx].remaining = '';
              val.remainingPercent = budgetObj.subPortfolioBudgetNextYear[idx].remainingPercent;
              budgetObj.subPortfolioBudgetNextYear[idx].remainingPercent = '';
            }
          });
        });
      }

      await Portfolio.update({
        status: 'Active',
        id: portfolio.id
      }).set({
        portfolioBudgetingList: portfolio.portfolioBudgetingList,
        subPortfolioBudgetingList: portfolio.subPortfolioBudgetingList,
      });
    });

    let programs = await Program.find({ status: 'Active' });
    programs.map(async program => {
      if (program.programBudgetCurrentYear) {
        program.programBudgetCurrentYear.forEach((val, idx) => {
          if (program.programBudgetNextYear) {
            val.budget = program.programBudgetNextYear[idx].budget;
            program.programBudgetNextYear[idx].budget = '';
            val.assigned = program.programBudgetNextYear[idx].assigned;
            program.programBudgetNextYear[idx].assigned = '';
            val.remaining = program.programBudgetNextYear[idx].remaining;
            program.programBudgetNextYear[idx].remaining = '';
            val.remainingPercent = program.programBudgetNextYear[idx].remainingPercent;
            program.programBudgetNextYear[idx].remainingPercent = '';
          }
        });
        program.programBudgetNextYear = undefined;
      }
    });

    res.ok({
      message: 'Budget Switch Completed.'
    });
  }
};
