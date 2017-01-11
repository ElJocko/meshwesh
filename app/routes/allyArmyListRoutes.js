'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var validator = require('express-jsonschema');
var allyArmyListController = require('../controllers/allyArmyListController');
var schemas = require('./schemas/allyArmyListSchemas');

var router = express.Router();

// Routes
router.route('/v1/allyArmyLists')
    .get(
        validator.validate(schemas.retrieveAllyArmyListsByQuery),
        allyArmyListController.retrieveByQuery)
    .post(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.createAllyArmyList),
        allyArmyListController.create);

router.route('/v1/allyArmyLists/:listId')
    .get(
        validator.validate(schemas.retrieveAllyArmyListById),
        allyArmyListController.retrieveById)
    .put(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.updateAllyArmyList),
        allyArmyListController.update)
    .delete(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.deleteAllyArmyList),
        allyArmyListController.delete);

router.route('/v1/allyArmyListsImport')
    .post(
        tokenAuthz.requireAdminRole,
        allyArmyListController.import);

module.exports = router;