'use strict';

var crypto = require('crypto');

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        hostname: process.env.HOSTNAME
    },
    database: {
        url: process.env.MONGOLAB_URI || process.env.MONGODB_URL
    },
    app: {
        name: 'meshwesh',
        env: process.env.NODE_ENV || 'development'
    },
    security: {
        adminToken: process.env.APP_ADMIN_TOKEN,
        jwtSecret: crypto.randomBytes(40).toString('base64')
    }
};
