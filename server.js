// server.js

var util = require('util');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var user = require('./routes/user');
var middleware = require('./routes/middleware');

app.use('/api', middleware);
app.use('/api', user);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
});

var mongoose = require('mongoose');

var mongoDbUri = process.env.MONGODB_URI || "mongodb://heroku_gwnd8m9d:1acaom7sska0s31bflk6id3gma@ds041586.mlab.com:41586/heroku_gwnd8m9d";

mongoose.connect(mongoDbUri);

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function () {
    var port = process.env.PORT || 8080;

    app.listen(port);

    console.log('Magic happens on port ' + port);
});