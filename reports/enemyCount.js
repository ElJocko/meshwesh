'use strict';

const dotenv = require('dotenv');
dotenv.load({ path: '../bin/deploy/dev.env' });

const logger = require('../app/lib/logger');

logger.info('Invincible Meshwesh app starting');

// Configure the app
logger.info('Configuring the app');
const config = require('../app/lib/config');

// Establish the database connection
logger.info('Setting up the database connection');
const dbConnection = require('../app/lib/dbConnection');

const armyListService = require('../app/services/armyListService');
const enemyXrefService = require('../app/services/enemyXrefService');

armyListService.retrieveByQueryLean({}, function(err, armyLists) {
    armyLists.forEach(function(armyList) {
        enemyXrefService.getEnemies(armyList.id, function(err, enemyList) {
            if (enemyList.length === 0) {
                console.log(armyList.name, ': ', enemyList.length);
            }
        });
    });
});
