/**
 * TeamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    projectTeam: async (req, res) => {
        try {
            const team = await Team.findOne({ project: req.params.id }).populateAll();
            res.ok(team);
        } catch (e) {
            res.badRequest(e);
        }
    },

    userTeamProjects: async (req, res) => {
        try {
            const user = await User.findOne({ id: req.params.id }).populateAll();
            let reportIds = [];
            let projectIds = [];

            if (user.teams.length > 0) {
                user.teams.forEach(async team => {
                    projectIds.push(team.project);
                });

                // const reports = await Reports.find({ id: { in: reportIds } });

                // reports.forEach(async report => {
                //     projectIds.push(report.project);
                // });

                const projects = await Projects.find({ id: { in: projectIds } }).populate('projectOutline')
                    .populate('projectOrder').populate('changeRequests').populate('closingReport')
                    .populate('projectReport').sort('uid DESC');

                res.ok(projects);
            } else {
                res.ok([]);
            }
        } catch (e) {
            res.badRequest(e);
        }
    },

};

