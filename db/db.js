var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uri = 'mongodb://admin:admin@ds119578.mlab.com:19578/prjct';
mongoose.connect(uri);

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + uri);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

module.exports = mongoose;
