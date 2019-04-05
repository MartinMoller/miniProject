var mongoose = require('mongoose');

function connect(connectionString) {
  return mongoose.connect(connectionString);
}
function disconnect() {
  return mongoose.connection.close();
}
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open ');
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection closed ');
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

module.exports = { connect, disconnect };

