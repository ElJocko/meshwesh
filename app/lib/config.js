'use strict';

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        hostname: process.env.HOSTNAME
    },
    database: {
        name: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        options: {
            host: 'localhost',
            dialect: 'postgres',

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
