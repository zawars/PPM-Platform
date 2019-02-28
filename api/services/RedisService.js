const redis = require('redis');
const client = redis.createClient();

client.on('connect', function () {
  console.log('Redis client connected');
});

client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

module.exports = {
  set: (key, val, done) => {
    client.set(key, JSON.stringify(val), redis.print);
    done();
  },

  get: (key, done) => {
    client.get(key, function (error, result) {
      if (error) {
        console.log('Redis :: ' + error);
        throw error;
      }
      return done(JSON.parse(result));
    });
  },

  del: (key, done) => {
    client.del(key, function (err, response) {
      if (response == 1) {
        console.log("Deleted Successfully!");
        done(response);
      } else {
        console.log("Cannot delete");
      }
    });
  },
};
