'use strict';

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
        adminToken: process.env.APP_ADMIN_TOKEN
    }
};
