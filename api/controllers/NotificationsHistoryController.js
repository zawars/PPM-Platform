/**
 * NotificationsHistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    getAllNotifications: (req, res) => {
        let limit = 0;
        if (req.param('limit')) {
            limit = req.param('limit');
        }
        NotificationsHistory.find({})
            .sort('createdAt DESC')
            .limit(limit)
            .populateAll()
            .then((notifications) => {
                if (notifications) {
                    let unseen = 0;
                    let allNotifications = [];
                    notifications.forEach(notification => {
                        let desc = NotificationsService.getTemplate(notification.projectItem, notification.action, notification.actor.name);
                        if (!notification.isSeen) { unseen++; }
                        let notifItem = {
                            projectId: notification.projectId.uid,
                            description: desc,
                            date: new Date(notification.createdAt).toDateString() + ', ' + new Date(notification.createdAt).toLocaleTimeString()
                        }
                        allNotifications.push(notifItem);
                    });
                    res.ok({ unseen, allNotifications });
                }
            }).catch(error => {
                res.badRequest(error);
            })
    },
    seenNotifications: (req, res) => {
        NotificationsHistory.update({ isSeen: false }, { isSeen: true }).exec(function (err, updated) {
            if (err) {
                res.json(err)
            } else {
                res.ok(updated);
            }
        })
    }
};



