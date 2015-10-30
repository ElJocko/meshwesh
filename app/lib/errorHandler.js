'use strict';

var logger = require('./logger');

exports.bodyParser = function(err, req, res, next) {
    if (err.name === 'SyntaxError') {
        logger.warn('Unable to parse body, syntax error: ' + err.type);
        res.status(400).send('Syntax error.');
    }
    else {
        next(err);
    }
};

exports.catchAll = function(err, req, res, next) {
    logger.error('catch all: ' + err);
    res.status(500).send('Server error (catch all).');
};