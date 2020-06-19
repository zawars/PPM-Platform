/**
 * SmallOrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('getSelectiveOrders', data => {
    let ordersIds = data.ids;
    SmallOrder.find({
      id: ordersIds
    }).then(orders => {
      socket.emit('getSelectiveOrders', orders);
    }).catch(err => {
      ErrorsLogService.logError('Orders', err.toString(), 'getSelectiveOrders', '', socket.user.id);
    })
  });

  socket.on('smallOrdersFilter', data => {
    try {
      let filters = data.filtersArray;
      let filtersObj = {};

      filters.forEach(filter => {
        let key = Object.keys(filter)[0];
        filtersObj[key] = filter[key];
      })

      SmallOrder.find({}).where(filtersObj).populateAll().then(orders => {
        socket.emit('smallOrdersFilter', orders);
      })
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersFilter', '', socket.user.id);
    }
  });

  //To paginate smallOrders table
  socket.on('smallOrdersIndex', async data => {
    try {
      let smallOrders = await SmallOrder.find().paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populateAll();
      socket.emit('smallOrdersIndex', smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersIndex', '', socket.user.id);
    }
  });

  //To get count of total small Orders
  socket.on('smallOrdersCount', async data => {
    try {
      let count = await SmallOrder.count();
      socket.emit('smallOrdersCount', count);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersCount', '', socket.user.id);
    }
  });

  //To paginate smallOrders table for user
  socket.on('smallOrdersByUserIndex', async data => {
    try {
      let smallOrders = await SmallOrder.find({
          orderManager: data.userId
        }).paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .populateAll().sort('createdAt DESC');
      socket.emit('smallOrdersByUserIndex', smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersByUserIndex', '', socket.user.id);
    }
  });

  //To get count of total small Orders for user
  socket.on('smallOrdersByUserCount', async data => {
    try {
      let count = await SmallOrder.count({
        orderManager: data.userId
      });
      socket.emit('smallOrdersByUserCount', count);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersByUserCount', '', socket.user.id);
    }
  });

  //To paginate smallOrders by sponsor table
  socket.on('smallOrdersBySponsorIndex', async data => {
    try {
      let smallOrders = await SmallOrder.find({
          orderSponsor: data.userId,
          status: {
            not: 'Draft'
          }
        }).paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .populateAll().sort('createdAt DESC');
      socket.emit('smallOrdersBySponsorIndex', smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersBySponsorIndex', '', socket.user.id);
    }
  });

  //To get count of total small Orders by sponsor for user
  socket.on('smallOrdersBySponsorCount', async data => {
    try {
      let count = await SmallOrder.count({
        orderSponsor: data.userId,
        status: {
          not: 'Draft'
        }
      });
      socket.emit('smallOrdersBySponsorCount', count);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'smallOrdersBySponsorCount', '', socket.user.id);
    }
  });

  //To get selective smallOrders by multiple smallOrder Ids
  socket.on('selectiveSmallOrdersIndex', async data => {
    try {
      let smallOrders = await SmallOrder.find({
        id: {
          $in: data.orderIds
        }
      }).populateAll();
      socket.emit('selectiveSmallOrdersIndex', smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', error.toString(), 'selectiveSmallOrdersIndex', '', socket.user.id);
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

  getSmallOrders: async (req, res) => {
    try {
      let smallOrders = await SmallOrder.find().limit(req.query.limit || 10).populateAll();
      res.ok(smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', err.toString(), 'index', req);
    }
  },

  getSmallOrdersByUser: async (req, res) => {
    try {
      let smallOrders = await SmallOrder.find({
          orderManager: req.params.id
        }).limit(req.query.limit || 10)
        .populateAll().sort('createdAt DESC');
      res.ok(smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', `id: ${req.params.id}, ` + error.toString(), 'getSmallOrdersByUser', req);
    }
  },

  getSmallOrdersBySponsor: async (req, res) => {
    try {
      let smallOrders = await SmallOrder.find({
          orderSponsor: req.params.id,
          status: {
            not: 'Draft'
          }
        }).limit(req.query.limit || 10)
        .populateAll().sort('createdAt DESC');
      res.ok(smallOrders);
    } catch (error) {
      ErrorsLogService.logError('Small Order', `id: ${req.params.id}, ` + error.toString(), 'getSmallOrdersBySponsor', req);
    }
  },

  searchOrders: async (req, res) => {
    let query = req.params.query;

    try {
      let orders = await SmallOrder.find({
        or: [{
            name: {
              'contains': query
            }
          },
          {
            uid: {
              'contains': query
            }
          }
        ]
      }, {
        fields: {
          uid: 1,
          name: 1
        }
      }).limit(10).sort('uid DESC');

      res.send(orders);

    } catch (error) {
      ErrorsLogService.logError('SmallOrder', error.toString(), 'searchOrders', req);
      res.badRequest(error);
    }
  }

};
