/**
 * SmallOrderTeamController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    smallOrderTeam: async (req, res) => {
        try {
          let team = await SmallOrderTeam.findOne({
            smallOrder: req.params.id
          }).populateAll();
          if (team) {
            let teamUsers = [];
            if (team.users.length > 0) {
              team.users.forEach(async (user, index) => {
                let right = await SmallOrderRights.findOne({
                  smallOrder: req.params.id,
                  user: user.id
                }).populateAll();
                let userObj = {
                  user: '',
                  id: '',
                  isView: '',
                  isEdit: ''
                };
                userObj.user = user;
                userObj.id = right.id;
                userObj.isView = right.isView;
                userObj.isEdit = right.isEdit;
                teamUsers.push(userObj);
    
                if (teamUsers.length == team.users.length) {
                  res.ok({
                    teamId: team.id,
                    teamUsers: teamUsers
                  });
                }
              });
            } else {
              res.ok([]);
            }
          } else {
            res.ok([]);
          }
        } catch (e) {
          res.badRequest(e);
        }
      },
    
};

