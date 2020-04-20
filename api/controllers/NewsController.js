/**
 * NewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('newsIndex', data => {
    News.find()
      .paginate({ page: data.pageIndex, limit: data.pageSize })
      .sort('eventDate DESC').then(newsResp => {
        let newsArray = [];
        newsResp.forEach(element => {
          let newsItem = {
            id: element.id,
            eventDate: new Date(element.eventDate).toDateString(),
            description: element.description,
            type: element.isPast ? 'Past' : 'Upcoming',
            linkText: element.linkText,
            link: element.link
          }
          newsArray.push(newsItem);
        });
        socket.emit('newsIndex', newsArray);
      }).catch(error => {
        ErrorsLogService.logError('News', error.toString(), 'newsIndex', '', socket.user.id);
      });
  });

  socket.on('newsCount', async data => {
    try {
      let count = await News.count();
      socket.emit('newsCount', count);
    } catch (error) {
      ErrorsLogService.logError('News', error.toString(), 'newsCount', '', socket.user.id);
    }
  });

  //To search in data table of News
  socket.on('newsSearch', async data => {
    let search = data.search;

    let count = await News.count({
      or: [
        { eventDate: { contains: search } },
        { description: { contains: search } }
      ]
    });

    News.find({
      or: [
        { eventDate: { contains: search } },
        { description: { contains: search } }]
    }).limit(10).populateAll().sort('eventDate DESC').then(newsResp => {
      let newsArray = [];
      newsResp.forEach(element => {
        let newsItem = {
          id: element.id,
          eventDate: new Date(element.eventDate).toDateString(),
          description: element.description,
          type: element.isPast ? 'Past' : 'Upcoming',
          linkText: element.linkText,
          link: element.link
        }
        newsArray.push(newsItem);
      });
      socket.emit('newsSearch', { count: count, news: newsArray });
    }).catch(error => {
      ErrorsLogService.logError('News', error.toString(), 'newsSearch', '', socket.user.id);
    });
  });

  //To paginate search results of News
  socket.on('newsSearchIndex', data => {
    let search = data.search;
    News.find({
      or: [
        { eventDate: { contains: search } },
        { description: { contains: search } }
      ]
    }).paginate({ page: data.pageIndex, limit: data.pageSize }).populateAll().sort('eventDate DESC').then(newsResp => {
      let newsArray = [];
      newsResp.forEach(element => {
        let newsItem = {
          id: element.id,
          eventDate: new Date(element.eventDate).toDateString(),
          description: element.description,
          type: element.isPast ? 'Past' : 'Upcoming',
          linkText: element.linkText,
          link: element.link
        }
        newsArray.push(newsItem);
      });
      socket.emit('newsSearchIndex', newsArray);
    }).catch(error => {
      ErrorsLogService.logError('News', error.toString(), 'newsSearchIndex', '', socket.user.id);
    });
  });

  socket.on('newsByType', async data => {
    let upcomingNews = [];
    let pastNews = [];

    await News.find({ isPast: true }).sort('eventDate DESC').limit(10).then(newsResp => {
      newsResp.forEach(element => {
        let newsItem = {
          eventDate: new Date(element.eventDate).toDateString(),
          description: element.description,
          linkText: element.linkText,
          link: element.link
        }
        pastNews.push(newsItem);
      });
    }).catch(err => {
      ErrorsLogService.logError('News', err.toString(), 'newsByType', '', socket.user.id);
    });

    News.find({ isPast: false }).sort('eventDate DESC').limit(10).then(newsResp => {
      newsResp.forEach(element => {
        let newsItem = {
          eventDate: new Date(element.eventDate).toDateString(),
          description: element.description,
          linkText: element.linkText,
          link: element.link
        }
        upcomingNews.push(newsItem);
      });
      socket.emit('newsByType', { upcomingNews, pastNews });
    }).catch(err => {
      ErrorsLogService.logError('News', JSON.stringify(err), 'newsByType', '', socket.user.id);
    });
  })
})


module.exports = {
  index: (req, resp) => {
    let limit = 0;
    if (req.param('limit')) {
      limit = req.param('limit');
    }
    News.find()
      .limit(limit)
      .sort('eventDate DESC').then((newsResp) => {
        let newsArray = [];
        newsResp.forEach(element => {
          let newsItem = {
            id: element.id,
            eventDate: new Date(element.eventDate).toDateString(),
            description: element.description,
            type: element.isPast ? 'Past' : 'Upcoming',
            linkText: element.linkText,
            link: element.link
          }
          newsArray.push(newsItem);
        });
        resp.ok(newsArray);
      })
      .catch(err => {
        ErrorsLogService.logError('News', err.toString(), 'index', req);
        resp.badRequest(err);
      })
  },

  create: (req, res) => {
    let data = req.body;
    News.create(data).then(response => {
      res.ok(response);
    }).catch(error => {
      ErrorsLogService.logError('News', error.toString(), 'create', req);
    });
  },
};

