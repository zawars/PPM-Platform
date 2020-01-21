/**
 * ProjectBudgetCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const io = SocketService.io;

io.on('connection', socket => {

  socket.on('projectBudget', async data => {
    try {
      let id = data.id;
      let budget = await ProjectBudgetCost.find({ 'project': id }).populateAll();
      socket.emit('projectBudget', budget);
    } catch (e) {
      console.log(e);
    }
  })

  // socket.on('projectBudgetByYearCount', async data => {
  //   try {
  //     let result = await ProjectBudgetCost.count({
  //       portfolioBudgetYear: data.id
  //     });
  //     socket.emit('projectBudgetByYearCount', result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearSearch', async data => {
  //   let search = data.search.toLowerCase();
  //   let count = 0;

  //   try {
  //     let results = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).populateAll();

  //     let searchResults = results.filter(result => {
  //       let check = result.project.uid == parseInt(search) || result.project.projectName.toLowerCase().includes(search)
  //         || (result.project.status && result.project.status.toLowerCase().includes(search));

  //       return check;
  //     });

  //     count = searchResults.length;
  //     let paginatedResults = SocketService.paginateArray(searchResults, 10, 1);
  //     socket.emit('projectBudgetByYearSearch', { count, projects: paginatedResults });

  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearSearchIndex', async data => {
  //   let search = data.search.toLowerCase();

  //   try {
  //     let results = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).populateAll();

  //     let searchResults = results.filter(result => {
  //       let check = result.project.uid == parseInt(search) || result.project.projectName.toLowerCase().includes(search)
  //         || (result.project.status && result.project.status.toLowerCase().includes(search));

  //       return check;
  //     });

  //     let paginatedResults = SocketService.paginateArray(searchResults, data.pageSize, data.pageIndex);
  //     socket.emit('projectBudgetByYearSearchIndex', paginatedResults);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on('projectBudgetByYearIndex', async data => {
  //   try {
  //     let result = await ProjectBudgetCost.find({
  //       portfolioBudgetYear: data.id
  //     }).paginate({ page: data.pageIndex, limit: data.pageSize })
  //       .populateAll();

  //     socket.emit('projectBudgetByYearIndex', result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

});

module.exports = {

  deleteProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      await ProjectBudgetCost.destroy({ 'project': id });
      res.ok({ message: 'Deleted Project Budget Cost' });
    } catch (e) {
      res.badRequest(e);
    }
  },

  getProjectBudget: async (req, res) => {
    try {
      let id = req.params.id;
      let budget = await ProjectBudgetCost.find({ 'project': id }).populateAll();
      res.ok(budget);
    } catch (e) {
      res.badRequest(e);
    }
  },

  //It retrieves all projects' budget cost for a selected Budget Year
  budgetsByYear: async (req, res) => {
    ProjectBudgetCost.native(async function (err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $lookup:
          {
            from: "projects",
            localField: 'project',
            foreignField: '_id',
            as: "projectitem"
          }
        },
        {
          $unwind: '$projectitem'
        },
        {
          $lookup:
          {
            from: "reports",
            let: { project: '$project' },
            pipeline: [
              {
                $match:
                {
                  $expr:
                    { $eq: ["$project", "$$project"] },
                }
              },
              { $project: { status: 1, digitalizationDegree: 1, plannedEndDate: 1 } }
            ],
            as: "report"
          }
        },
        {
          $unwind: { path: '$report', preserveNullAndEmptyArrays: true }
        }
      ]).toArray(function (err, results = []) {
        if (err) return res.ok(err);
        let finalResult = results.filter(result => {
          return result.portfolioBudgetYear == req.params.id;
        })
        res.ok(finalResult);
      })
    });
  },

  updateMultipleProjectsBudget: (req, res) => {
    let projectsBudget = req.body.projectsBudget;
    projectsBudget.forEach(async (project, index) => {
      let result = await ProjectBudgetCost.update({ id: project.id })
        .set({ budget: project.budget })

      if (index == projectsBudget.length - 1) {
        res.ok(result);
      }
    });
  },

  createBudgetByYear: async (req, res) => {
    let subPortfolio = req.body.subPortfolio;
    let portfolioBudgetYear = req.body.portfolioBudgetYear;
    let year = req.body.year;
    let budget = [
      {
        costType: "External Costs",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 0,
        group: "CAPEX",
      }, {
        costType: "Internal Costs",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 1,
        group: "CAPEX",
      }, {
        costType: "External Costs",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 2,
        group: "OPEX"
      }, {
        costType: "Internal Costs",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 3,
        group: "OPEX"
      }, {
        costType: "Revenues",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 4,
        group: "Sonstiges",
      }, {
        costType: "Reserves",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        group: "Sonstiges",
        id: 5,
      }, {
        costType: "Total",
        budget: '',
        thereofICT: '',
        actualCost: "",
        forecast: "",
        id: 6,
        group: "Sonstiges",
      },
    ];

    let subportfolioProjects = await Reports.find({
      or: [
        { status: 'Active', 'subPortfolio.id': subPortfolio },
        { status: 'Closed', isFicoApprovedClosingReport: true, ficoApprovedClosingReportDate: { contains: year }, 'subPortfolio.id': subPortfolio }
      ]
    });

    subportfolioProjects.forEach((project, index) => {
      ProjectBudgetCost.create({
        portfolioBudgetYear: portfolioBudgetYear,
        project: project.projectId,
        budget: budget
      }).then(result => {
        if (index == subportfolioProjects.length - 1) {
          res.ok(result);
        }
      }).catch(error => {
        res.ok({ error });
      });
    });
  }

};

