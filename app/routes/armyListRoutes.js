'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var validator = require('express-jsonschema');
var armyListController = require('../controllers/armyListController');
var schemas = require('./schemas/armyListSchemas');

var router = express.Router();

// Routes
router.route('/v1/armyLists')
    .get(
        validator.validate(schemas.retrieveArmyListsByQuery),
        armyListController.retrieveByQuery)
    .post(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.createArmyList),
        armyListController.create);

router.route('/v1/armyLists/:listId')
    .get(
        validator.validate(schemas.retrieveArmyListById),
        armyListController.retrieveById)
    .put(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.updateArmyList),
        armyListController.update)
    .delete(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.deleteArmyList),
        armyListController.delete);

router.route('/v1/armyListsImport')
    .post(
        tokenAuthz.requireAdminToken,
        armyListController.import);

router.route('/v1/troopOptionsImport')
    .post(
        tokenAuthz.requireAdminToken,
        armyListController.importTroopOptions);

module.exports = router;