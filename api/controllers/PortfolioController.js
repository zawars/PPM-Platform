/**
 * PortfolioController
 *
 * @description :: Server-side logic for managing Portfolios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const io = SocketService.io;

io.on('connection', socket => {

  //To get count for all records
  socket.on('portfoliosCount', async data => {
    try {
      let count = await Portfolio.count();
      socket.emit('portfoliosCount', count);
    } catch (error) {
      ErrorsLogService.logError('Portfolio', error.toString(), 'portfoliosCount', '', socket.user.id);
    }
  });

  //To paginate all records
  socket.on('portfoliosIndex', data => {
    Portfolio.find()
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(portfolios => {
        socket.emit('portfoliosIndex', portfolios);
      })
      .catch(error => {
        ErrorsLogService.logError('Portfolio', error.toString(), 'portfoliosIndex', '', socket.user.id);
      });
  });

  socket.on('activePortfolios', data => {
    Portfolio.find({ status: "Active" }).sort({ name: 'ASC' }).populateAll().then(response => {
      socket.emit('activePortfolios', response);
    }).catch(err => {
      ErrorsLogService.logError('Portfolio', err.toString(), 'activePortfolios', '', socket.user.id);
      socket.emit('activePortfolios', err);
    });
  })

  socket.on('portfoliosSearch', async data => {
    let search = data.search;

    let count = await Portfolio.count({
      or: [
        { name: { contains: search } },
        { status: { contains: search } },
        { 'businessUnit.name': { contains: search } }
      ]
    });

    Portfolio.find({
      or: [
        { name: { contains: search } },
        { status: { contains: search } },
        { 'businessUnit.name': { contains: search } }
      ]
    }).limit(10).populateAll().then(portfolios => {
      socket.emit('portfoliosSearch', { count, portfolios });
    })
      .catch(error => {
        ErrorsLogService.logError('Portfolio', error.toString(), 'portfoliosSearch', '', socket.user.id);
      });
  });

  socket.on('portfoliosSearchIndex', data => {
    let search = data.search;

    Portfolio.find({
      or: [
        { name: { contains: search } },
        { status: { contains: search } },
        { 'businessUnit.name': { contains: search } }
      ]
    }).paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(portfolios => {
        socket.emit('portfoliosSearchIndex', portfolios);
      })
      .catch(error => {
        ErrorsLogService.logError('Portfolio', error.toString(), 'portfoliosSearchIndex', '', socket.user.id);
      });
  });
});


module.exports = {
  getActivePortfolios: (req, res) => {
    Portfolio.find({
      status: "Active"
    }).populateAll().then(response => {
      res.ok(response);
    }).catch(error => {
      ErrorsLogService.logError('Project Outline', error.toString(), 'getActivePortfolios', req);
    });
  },
};

