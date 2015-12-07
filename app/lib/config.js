'use strict';

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        hostname: process.env.HOSTNAME
    },
    database: {
        url: process.env.DATABASE_URL,
        options: {
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        }
    },
    app: {
        name: 'meshwesh',
        env: process.env.NODE_ENV || 'development'
    },
    security: {
        adminToken: process.env.APP_ADMIN_TOKEN
    }
};
