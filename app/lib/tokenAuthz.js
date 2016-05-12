'use strict';

var config = require('./config');
var logger = require('./logger');
var jwt = require('jwt-simple');

exports.requireAdmin = function(request, response, next) {
    // request must include the admin token
    var token = request.get('PRIVATE-TOKEN');

    if (!token) {
        logger.warn('tokenAuthz.requireAdmin: Missing token');
        return response.status(401).send('Not authorized');
    }

    var payload = decodeToken(token);

    if (payload.role === 'admin') {
        return next();
    }
    else {
        logger.warn('tokenAuthz.requireAdmin: Not admin role');
        return response.status(401).send('Not authorized');
    }
};

exports.requireEditor = function(request, response, next) {
    // request must include the admin token
    var token = request.get('PRIVATE-TOKEN');

    if (!token) {
        logger.warn('tokenAuthz.requireEditor: Missing token');
        return response.status(401).send('Not authorized');
    }

    var payload = decodeToken(token);

    if (payload.role === 'admin' || payload.role === 'editor') {
        return next();
    }
    else {
        logger.warn('tokenAuthz.requireEditor: Not admin or editor role');
        return response.status(401).send('Not authorized');
    }
};

function decodeToken(token) {
    var plainToken = jwt.decode(token, config.security.jwtSecret);
    return plainToken;
}
