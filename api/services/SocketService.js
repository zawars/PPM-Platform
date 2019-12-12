const io = require('socket.io')(1338);

module.exports.io = io;

module.exports.paginateArray = function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}