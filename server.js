/*
  Based on https://github.com/madhums/node-express-mongoose-demo
*/

// Imports
var debug = require('debug')('instacase');
debug('Booting Instacase');

var express = require('express');
var fs = require('fs');
var passport = require('passport');

// Load server config
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env]

// Set up the database
var mongoose = require('mongoose');
debug('Connecting to MongoDB at ' + config.db);
var connect = function() {
    mongoose.connect(config.db, {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    });
};
connect();

mongoose.connection.on('error', function(err) {
    console.error('Could not connect to MongoDB at ' + config.db + '. ' + err);
});

// Automatically reconnect to the database
mongoose.connection.on('disconnected', function() {
    connect();
});

// Set up models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function(file) {
    if (file.indexOf('.js') === file.length - 3) require(models_path + '/' + file);
});

// OAuth config
require('./config/passport')(passport, config);

// Set up the app!
var app = express();

// Load express settings
require('./config/express')(app, config, passport);

// Load routes
var auth = require('./config/middlewares/authorization');
require('./config/routes')(app, passport, auth);

// Start the app!
app.set('port', process.env.PORT || 3000);
debug('Setting port to ' + app.get('port') + ' and starting server');
app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + this.address().port);
});

// expose the app
module.exports = app;
