/**
 * SmallOrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  //To paginate smallOrders table
  socket.on('smallOrdersIndex', async data => {
    try {
      let smallOrders = await SmallOrder.find({ user: data.userId }).paginate({ page: data.pageIndex, limit: data.pageSize })
        .populateAll().sort('createdAt DESC');
      socket.emit('approvalsIndex', smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersIndex', '', socket.user.id);
    }
  });

  //To get count of total small Orders for user
  socket.on('smallOrdersCount', async data => {
    try {
      let count = await SmallOrder.count({ user: data.userId });
      socket.emit('smallOrdersCount', count);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersCount', '', socket.user.id);
    }
  });

  //To search users
  socket.on('searchUsers', async data => {
    try {
      let query = data.search;
      let users = await User.find({
        or: [{
            name: {
              'contains': query
            }
          },
          {
            email: {
              'contains': query
            }
          }
        ]
      });
      socket.emit('searchUsers', users);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'searchUsers', '', socket.user.id);
    }
  });

});

module.exports = {

  getSmallOrdersByUser: async (req, res) => {
    try {
      let smallOrders = await SmallOrder.find({ user: req.params.id }).limit(req.query.limit || 10)
        .populateAll().sort('createdAt DESC');
      res.ok(smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', `id: ${req.params.id}, ` + error.toString(), 'getSmallOrdersByUser', req);
    }
  },

};

