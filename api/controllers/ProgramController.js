/**
 * ProgramController
 *
 * @description :: Server-side logic for managing Programs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const io = SocketService.io;

io.on('connection', socket => {

  socket.on('fetchProgram', data => {
    Program.findOne({
      id: data.programId
    }).populateAll().then(program => {
      socket.emit('fetchProgram', program);
    }).catch(error => {
      ErrorsLogService.logError('Program', `id: ${data.programId}, ` + error.toString(), 'fetchProgram', '', socket.user.id);
    });
  });

  socket.on('activePrograms', data => {
    Program.find({
      status: 'Active'
    }).populateAll().then(programsList => {
      socket.emit('activePrograms', programsList);
    }).catch(error => {
      ErrorsLogService.logError('Program', error.toString(), 'activePrograms', '', socket.user.id);
    });
  });

  socket.on('programsIndex', data => {
    if (data.userId) {
      Program.find({
          or: [{
              programManager: data.userId
            },
            {
              programSponsor: data.userId
            }
          ]
        }).paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .populateAll().then(programs => {
          socket.emit('programsIndex', programs);
        }).catch(error => {
          ErrorsLogService.logError('Program', error.toString(), 'programsIndex', '', socket.user.id);
        });
    } else {
      Program.find()
        .paginate({
          page: data.pageIndex,
          limit: data.pageSize
        })
        .populateAll().then(programs => {
          socket.emit('programsIndex', programs);
        }).catch(error => {
          ErrorsLogService.logError('Program', `id: ${data.userId}, ` + error.toString(), 'programsIndex', '', socket.user.id);
        });
    }
  });

  socket.on('programsCount', async data => {
    try {
      if (data.userId) {
        let count = await Program.count({
          or: [{
              programManager: data.userId
            },
            {
              programSponsor: data.userId
            }
          ]
        });
        socket.emit('programsCount', count);
      } else {
        let count = await Program.count();
        socket.emit('programsCount', count);
      }
    } catch (error) {
      ErrorsLogService.logError('Program', `id: ${data.userId}, ` + error.toString(), 'programsCount', '', socket.user.id);
    }
  });

  //To search in data table of programs
  socket.on('programsSearch', async data => {
    let search = data.search;

    if (data.userId) {

      let count = await Program.count({
        or: [{
            uid: parseInt(search),
            programManager: data.userId
          },
          {
            status: {
              contains: search
            },
            programManager: data.userId
          },
          {
            programName: {
              contains: search
            },
            programManager: data.userId
          },
          {
            uid: parseInt(search),
            programSponsor: data.userId
          },
          {
            status: {
              contains: search
            },
            programSponsor: data.userId
          },
          {
            programName: {
              contains: search
            },
            programSponsor: data.userId
          }
        ],
      });

      Program.find({
        or: [{
            uid: parseInt(search),
            programManager: data.userId
          },
          {
            status: {
              contains: search
            },
            programManager: data.userId
          },
          {
            programName: {
              contains: search
            },
            programManager: data.userId
          },
          {
            uid: parseInt(search),
            programSponsor: data.userId
          },
          {
            status: {
              contains: search
            },
            programSponsor: data.userId
          },
          {
            programName: {
              contains: search
            },
            programSponsor: data.userId
          }
        ]
      }).limit(10).populateAll().sort('createdAt DESC').then(programs => {
        socket.emit('programsSearch', {
          count: count,
          programs
        });
      }).catch(error => {
        ErrorsLogService.logError('Program', error.toString(), 'programsSearch', '', socket.user.id);
      });
    } else {
      let count = await Program.count({
        or: [{
            uid: parseInt(search)
          },
          {
            status: {
              contains: search
            }
          },
          {
            programName: {
              contains: search
            }
          }
        ]
      });
      Program.find({
        or: [{
            uid: parseInt(search)
          },
          {
            status: {
              contains: search
            }
          },
          {
            programName: {
              contains: search
            }
          }
        ]
      }).limit(10).populateAll().sort('createdAt DESC').then(programs => {
        socket.emit('programsSearch', {
          count: count,
          programs
        });
      }).catch(error => {
        ErrorsLogService.logError('Program', error.toString(), 'programsSearch', '', socket.user.id);
      });
    }
  });

  //To paginate search results of programs
  socket.on('programsSearchIndex', data => {
    let search = data.search;
    if (data.userId) {
      Program.find({
        or: [{
            uid: parseInt(search),
            programManager: data.userId
          },
          {
            status: {
              contains: search
            },
            programManager: data.userId
          },
          {
            programName: {
              contains: search
            },
            programManager: data.userId
          },
          {
            uid: parseInt(search),
            programSponsor: data.userId
          },
          {
            status: {
              contains: search
            },
            programSponsor: data.userId
          },
          {
            programName: {
              contains: search
            },
            programSponsor: data.userId
          }
        ]
      }).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populateAll().sort('createdAt DESC').then(programs => {
        socket.emit('programsSearchIndex', programs);
      }).catch(error => {
        ErrorsLogService.logError('Program', `userId: ${data.userId},` + error.toString(), 'programsSearchIndex', '', socket.user.id);
      });
    } else {
      Program.find({
        or: [{
            uid: parseInt(search)
          },
          {
            status: {
              contains: search
            }
          },
          {
            programName: {
              contains: search
            }
          }
        ]
      }).paginate({
        page: data.pageIndex,
        limit: data.pageSize
      }).populateAll().sort('createdAt DESC').then(programs => {
        socket.emit('programsSearchIndex', programs);
      }).catch(error => {
        ErrorsLogService.logError('Program', error.toString(), 'programsSearchIndex', '', socket.user.id);
      });
    }
  });
})



module.exports = {
  getActivePrograms: (req, res) => {
    Program.find({
      status: 'Active'
    }).populateAll().then(programsList => {
      res.ok(programsList);
    }).catch(error => {
      ErrorsLogService.logError('Program', error.toString(), 'getActivePrograms', req);
      res.badRequest(error);
    });
  },

  getProgramsByUser: (req, res) => {
    let limit = 0;
    if (req.param('limit')) {
      limit = req.param('limit');
    }
    Program.find({
      or: [{
          programManager: req.params.id
        },
        {
          programSponsor: req.params.id
        }
      ]
    }).limit(limit).populateAll().then(response => {
      res.ok(response);
    }).catch(error => {
      let userId = req.params.id;
      ErrorsLogService.logError('Program', `userId: ${userId},` + error.toString(), 'getProgramsByUser/:id', req);
      res.badRequest(error);
    });
  },
};
