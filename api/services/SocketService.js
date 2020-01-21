const io = require('socket.io')(5000);
const jwt = require('jsonwebtoken');

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, sails.config.secret, function (err, authData) {
      if (err) return next(new Error('Authentication error'));
      socket.user = authData;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
})

module.exports.io = io;

module.exports.paginateArray = function paginate(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}