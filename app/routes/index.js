'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var bookRoutes = require('./bookRoutes');
var thematicCategoryRoutes = require('./thematicCategoryRoutes');
var grandArmyListRoutes = require('./grandArmyListRoutes');
var armyListRoutes = require('./armyListRoutes');
var troopTypeRoutes = require('./troopTypeRoutes');
var userRoutes = require('./userRoutes');

var errorHandler = require('../lib/errorHandler');

var router = express.Router();

// Parse the request body
router.use('/api', bodyParser.json({limit: '1mb'}));
router.use('/api', bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Set up the routes
router.use('/api', bookRoutes);
router.use('/api', thematicCategoryRoutes);
router.use('/api', grandArmyListRoutes);
router.use('/api', armyListRoutes);
router.use('/api', troopTypeRoutes);
router.use('/api', userRoutes);

// Handle errors that haven't otherwise been caught
router.use(errorHandler.bodyParser);
router.use(errorHandler.requestValidation);
router.use(errorHandler.catchAll);

module.exports = router;