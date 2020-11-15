'use strict';

async function runServer() {
    // Configure the logger
    const logger = require('./app/lib/logger');

    logger.info('Invincible Meshwesh app starting');

    const os = require('os');
    logger.info('** hostname = ' + os.hostname());
    logger.info('** type = ' + os.type());
    logger.info('** platform = ' + os.platform());
    logger.info('** arch = ' + os.arch());
    logger.info('** release = ' + os.release());
    logger.info('** uptime = ' + os.uptime());
    logger.info('** versions = ' + JSON.stringify(process.versions));

    // Establish the database connection
    logger.info('Setting up the database connection');
    await require('./app/lib/dbConnection').initializeConnection();

    // Create the Express app
    const app = await require('./app').initializeApp();
    const config = app.get('config');

    // Start the server
    logger.info('Starting the server');
    const server = app.listen(config.server.port, function () {
        const host = server.address().address;
        const port = server.address().port;

        logger.info(`Listening at http://${host}:${port}`);
        logger.info('Invincible Meshwesh start up complete');
    })
}

runServer();

