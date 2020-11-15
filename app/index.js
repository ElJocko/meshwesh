'use strict';

exports.initializeApp = function() {
    const path = require('path');
    const logger = require('./lib/logger');

    // Configure the app
    logger.info('Configuring the app');
    const config = require('./lib/config');

    // Create the express application
    logger.info('Starting express');
    const express = require('express');
    const app = express();

    // Compress response bodies
    const compression = require('compression');
    app.use(compression());

    // Set HTTP response headers
    const helmet = require("helmet");
    app.use(helmet());

    // Only use request logger for development environment
    if (config.app.env === 'development') {
        logger.info('Enabling HTTP request logging');
        var morgan = require('morgan');
        app.use(morgan('dev', {stream: logger.stream}));
    }

    // Set up the static routes
    app.use(express.static(path.join(__dirname, '..', '/public')));

    // Set up the api routes
    logger.info('Creating the routes');
    const routes = require('./routes');
    app.use(routes);

    // Rewrite all other routes to make angular work
    app.use(function (req, res) {
        const indexPath = path.join(__dirname, '..', '/public/index.html');
        res.sendFile(indexPath);
    });

    // Make the config and logger accessible from the app
    app.set('config', config);
    app.set('logger', logger);

    return app;
}
