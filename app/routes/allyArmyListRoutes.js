'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const validator = require('express-jsonschema');
const allyArmyListController = require('../controllers/allyArmyListController');
const schemas = require('./schemas/allyArmyListSchemas');

const router = express.Router();

// Routes
router.route('/v1/allyArmyLists')
    .get(
        tokenAuthz.allowAll,
        validator.validate(schemas.retrieveAllyArmyListsByQuery),
        allyArmyListController.retrieveByQuery)
    .post(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.createAllyArmyList),
        allyArmyListController.create);

router.route('/v1/allyArmyLists/:listId')
    .get(
        tokenAuthz.allowAll,
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