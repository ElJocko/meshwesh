'use strict';

var config = require('./config');
var logger = require('./logger');

exports.requireAdminToken = function(request, response, next) {
    return next();

    // request must include the admin token
    var token = request.get('PRIVATE-TOKEN');

    if (!token) {
        logger.warn('tokenAuthz.requireAdminToken: Missing token');
        return response.status(401).send('Not authorized');
    }
    else if (token !== config.security.adminToken) {
        logger.warn('tokenAuthz.requireAdminToken: Incorrect token');
        return response.status(401).send('Not authorized');
    }
    else {
        return next();
    }
};

