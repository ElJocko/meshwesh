'use strict';

/**
 * Main routes module
 * @module app/routes
 *
 * Establishes the application's routes by using each of the resource route modules.
 *
 */

const express = require('express');
const bodyParser = require('body-parser');

const bookRoutes = require('./bookRoutes');
const thematicCategoryRoutes = require('./thematicCategoryRoutes');
const armyListRoutes = require('./armyListRoutes');
const allyArmyListRoutes = require('./allyArmyListRoutes');
const troopTypeRoutes = require('./troopTypeRoutes');
const userRoutes = require('./userRoutes');
const enemyXrefRoutes = require('./enemyXrefRoutes');
const logMessageRoutes = require('./logMessageRoutes');

const errorHandler = require('../lib/errorHandler');

const router = express.Router();

// Parse the request body
router.use('/api', bodyParser.json({limit: '1mb'}));
router.use('/api', bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Set up the routes
router.use('/api', bookRoutes);
router.use('/api', thematicCategoryRoutes);
router.use('/api', armyListRoutes);
router.use('/api', allyArmyListRoutes);
router.use('/api', troopTypeRoutes);
router.use('/api', userRoutes);
router.use('/api', enemyXrefRoutes);
router.use('/api', logMessageRoutes);

// Handle errors that haven't otherwise been caught
router.use(errorHandler.bodyParser);
router.use(errorHandler.requestValidation);
router.use(errorHandler.catchAll);

module.exports = router;