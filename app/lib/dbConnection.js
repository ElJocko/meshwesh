'use strict';

var config = require('./config');
var logger = require('./logger');
var mongoose = require('mongoose');
var events = require('events');

// Create the emitter
var emitter = new events.EventEmitter;

// Bootstrap db connection
var db = mongoose.connect(config.database.url);
logger.info('Mongoose attempting to connect to ' + config.database.url);

mongoose.connection.on('connected', function () {
    logger.info('Mongoose connected to ' + config.database.url);
    emitter.emit('ready');
});

mongoose.connection.on('disconnected', function () {
    logger.info('Mongoose disconnected from ' + config.database.url);
});

mongoose.connection.on('error', function (err) {
    logger.warn('Mongoose connection error: ' + err);
    logger.warn('Database (mongoose) connection is required. Terminating app.');

    // Delay 1 second for output to finish, then terminate
    //setTimeout(
    //    function(){
    //        process.exit(1);
    //    },
    //    1000);
});

module.exports = emitter;