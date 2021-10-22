/**
 * NotificationsHistoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('getCount', async data => {
    try {
      var todaysDate = new Date();
      var pastYear = todaysDate.getFullYear() - 1;
      todaysDate.setFullYear(pastYear);
      let yearbackdate = todaysDate.toISOString().split('T')[0]

      let notificationsCount = await NotificationsHistory.count({ createdAt: { '>=': yearbackdate } });
      socket.emit('getCount', notificationsCount);
    } catch (error) {
    }
  });

  socket.on('createNotification', async data => {
    try {
      let createdNotification = await NotificationsHistory.create(data);
      NotificationsHistory.findOne({ id: createdNotification.id })
        .populateAll()
        .then(notification => {
          let desc = NotificationsService.getTemplate(notification.projectItem, notification.action, notification.actor.name);
          let notifItem = {
            projectId: notification.projectId.uid,
            description: desc,
            date: new Date(notification.createdAt).toDateString() + ', ' + new Date(notification.createdAt).toLocaleTimeString()
          }
          socket.emit('notification', notifItem);
        });
    }
    catch (err) {
    }
  });

  socket.on('notificationsIndex', data => {
    var todaysDate = new Date();
    var pastYear = todaysDate.getFullYear() - 1;
    todaysDate.setFullYear(pastYear);
    let yearbackdate = todaysDate.toISOString().split('T')[0]

    NotificationsHistory.find({ createdAt: { '>=': yearbackdate } })
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .sort('createdAt DESC')
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
          socket.emit('notificationsIndex', ({ unseen, allNotifications }));
        } else {
          socket.emit('notificationsIndex', { unseen: 0, allNotifications: '' });
        }
      }).catch(error => {
      })
  });
});

module.exports = {
  getAllNotifications: (req, res) => {
    var todaysDate = new Date();
    var pastYear = todaysDate.getFullYear() - 1;
    todaysDate.setFullYear(pastYear);
    let yearbackdate = todaysDate.toISOString().split('T')[0]

    let limit = 0;
    if (req.param('limit')) {
      limit = req.param('limit');
    }
    NotificationsHistory.find({ createdAt: { '>=': yearbackdate } })
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



