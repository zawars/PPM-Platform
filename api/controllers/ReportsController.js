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
    let result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[6]]);

    for (let i = 0; i <= result.length; i += 7) {
      if (result[i]) {
        Reports.update({
          uid: result[i].projectId
        }).set({
          budgetPlanningTable2: [{
              "costType": result[i].costType,
              "budget": result[i].budget,
              "thereofICT": result[i].thereofICT,
              "actualCost": result[i].actualCost,
              "forecast": result[i].forecast,
              "id": result[i].id,
              "group": result[i].group
            },
            {
              "costType": result[i + 1].costType,
              "budget": result[i + 1].budget,
              "thereofICT": result[i + 1].thereofICT,
              "actualCost": result[i + 1].actualCost,
              "forecast": result[i + 1].forecast,
              "id": result[i + 1].id,
              "group": result[i + 1].group
            },
            {
              "costType": result[i + 2].costType,
              "budget": result[i + 2].budget,
              "thereofICT": result[i + 2].thereofICT,
              "actualCost": result[i + 2].actualCost,
              "forecast": result[i + 2].forecast,
              "id": result[i + 2].id,
              "group": result[i + 2].group
            },
            {
              "costType": result[i + 3].costType,
              "budget": result[i + 3].budget,
              "thereofICT": result[i + 3].thereofICT,
              "actualCost": result[i + 3].actualCost,
              "forecast": result[i + 3].forecast,
              "id": result[i + 3].id,
              "group": result[i + 3].group
            },
            {
              "costType": result[i + 4].costType,
              "budget": result[i + 4].budget,
              "thereofICT": result[i + 4].thereofICT,
              "actualCost": result[i + 4].actualCost,
              "forecast": result[i + 4].forecast,
              "id": result[i + 4].id,
              "group": result[i + 4].group
            },
            {
              "costType": result[i + 5].costType,
              "budget": result[i + 5].budget,
              "thereofICT": result[i + 5].thereofICT,
              "actualCost": result[i + 5].actualCost,
              "forecast": result[i + 5].forecast,
              "id": result[i + 5].id,
              "group": result[i + 5].group
            },
            {
              "costType": result[i + 6].costType,
              "budget": result[i + 6].budget,
              "thereofICT": result[i + 6].thereofICT,
              "actualCost": result[i + 6].actualCost,
              "forecast": result[i + 6].forecast,
              "id": result[i + 6].id,
              "group": result[i + 6].group
            }
          ]
        });
      }
    }

    fs.unlink(data.path, function (err) {
      if (err) return console.log(err); // handle error as you wish
      res.ok({
        message: 'Data Imported successfully.'
      });
    });
  }
};
