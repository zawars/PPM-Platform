/**
 * TeamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    projectTeam: async (req, res) => {
        try {
            let team = await Team.findOne({ project: req.params.id }).populateAll();
            if (team) {
                let teamUsers = [];
                if (team.users.length > 0) {
                    team.users.forEach(async (user, index) => {
                        let right = await Rights.findOne({ project: req.params.id, user: user.id }).populateAll();
                        let userObj = { user: '', id: '', isView: '', isEdit: '' };
                        userObj.user = user;
                        userObj.id = right.id;
                        userObj.isView = right.isView;
                        userObj.isEdit = right.isEdit;
                        teamUsers.push(userObj);

                        if (index == team.users.length - 1) {
                            res.ok({ teamId: team.id, teamUsers: teamUsers });
                        }
                    });
                } else {
                    res.ok([]);
                }
            } else {
                res.ok([]);
            }
        } catch (e) {
            ErrorsLogService.logError('Team', `id: ${req.params.id}` + e.toString(), 'projectTeam', req);
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
            ErrorsLogService.logError('Team', e.toString(), 'userTeamProjects', req);
            res.badRequest(e);
        }
    },

};

