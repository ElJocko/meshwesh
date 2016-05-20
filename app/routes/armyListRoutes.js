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
        tokenAuthz.requireEditor,
        validator.validate(schemas.createArmyList),
        armyListController.create);

router.route('/v1/armyLists/:listId')
    .get(
        validator.validate(schemas.retrieveArmyListById),
        armyListController.retrieveById)
    .put(
        tokenAuthz.requireEditor,
        validator.validate(schemas.updateArmyList),
        armyListController.update)
    .delete(
        tokenAuthz.requireEditor,
        validator.validate(schemas.deleteArmyList),
        armyListController.delete);

router.route('/v1/armyListsImport')
    .post(
//        tokenAuthz.requireAdmin,
        armyListController.import);

router.route('/v1/troopOptionsImport')
    .post(
//        tokenAuthz.requireAdmin,
        armyListController.importTroopOptions);

module.exports = router;