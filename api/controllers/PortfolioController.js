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
    let count = await Portfolio.count();
    socket.emit('portfoliosCount', count);
  });

  //To paginate all records
  socket.on('portfoliosIndex', data => {
    Portfolio.find()
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .populateAll().then(portfolios => {
        socket.emit('portfoliosIndex', portfolios);
      })
      .catch(error => {
        socket.emit('portfoliosIndex', error);
      });
  });

  socket.on('activePortfolios', data => {
    Portfolio.find({ status: "Active" }).populateAll().then(response => {
      socket.emit('activePortfolios', response);
    }).catch(err => {
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
        socket.emit('portfoliosSearch', error);
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
        socket.emit('portfoliosSearchIndex', error);
      });
  });
});


module.exports = {
  getActivePortfolios: (req, res) => {
    Portfolio.find({
      status: "Active"
    }).populateAll().then(response => {
      res.ok(response);
    }).catch(err => {
      res.badRequest(err);
    });
  },
};
