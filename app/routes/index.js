'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var thematicCategoryRoutes = require('./thematicCategoryRoutes');
var grandArmyListRoutes = require('./grandArmyListRoutes');
var armyListRoutes = require('./armyListRoutes');
var troopTypeRoutes = require('./troopTypeRoutes');

var errorHandler = require('../lib/errorHandler');

var router = express.Router();

// Parse the request body
router.use('/api', bodyParser.json());
router.use('/api', bodyParser.urlencoded({ extended: true }));

// Set up the routes
router.use('/api', thematicCategoryRoutes);
router.use('/api', grandArmyListRoutes);
router.use('/api', armyListRoutes);
router.use('/api', troopTypeRoutes);

// Handle errors that haven't otherwise been caught
router.use(errorHandler.bodyParser);
router.use(errorHandler.requestValidation);
router.use(errorHandler.catchAll);

module.exports = router;