'use strict';

var winston = require('winston');

var consoleTransport = new (winston.transports.Console) ({
    timestamp: function() {
        return new Date().toISOString();
    },
    formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() + ' [' + options.level.toUpperCase() + '] ' + (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
    }
});

var logLevels = {
    debug: 0,
    verbose: 1,
    info: 2,
    http: 3,
    warn: 4,
    error: 5
};

var logger = new winston.Logger ({
    transports: [
        consoleTransport
    ],
    levels: logLevels
});

logger.stream = {
    write: function(message, encoding) {
        // Write to the log. Remove the last character to avoid double 'new line' characters.
        logger.http(message.slice(0, -1));
    }
};

module.exports = logger;
