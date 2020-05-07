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
      let notificationsCount = await NotificationsHistory.count();
      socket.emit('getCount', notificationsCount);
    } catch (error) {
      ErrorsLogService.logError('NotificationsHistory', error.toString(), 'getCount', '', socket.user.id);
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
      ErrorsLogService.logError('NotificationsHistory', err.toString(), 'createNotification', '', socket.user.id);
    }
  });

  socket.on('notificationsIndex', data => {
    NotificationsHistory.find()
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
        ErrorsLogService.logError('NotificationsHistory', error.toString(), 'notificationsIndex', '', socket.user.id);
      })
  });
});

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
        ErrorsLogService.logError('NotificationsHistory', error.toString(), 'getAllNotifications', req);
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



