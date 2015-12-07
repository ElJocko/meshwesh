'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var validator = require('express-jsonschema');
var armyListController = require('../controllers/armyListController');
var schemas = require('./schemas/armyListRequestSchemas');

var router = express.Router();

// Routes
router.route('/v1/armyLists')
    .get(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.retrieveByQuerySchema),
        armyListController.retrieveByQuery)
    .post(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.createArmyListSchema),
        armyListController.create);

router.route('/v1/armyLists/:listId')
    .get(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.retrieveByIdSchema),
        armyListController.retrieveById)
    .put(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.updateArmyListSchema),
        armyListController.update)
    .delete(
        tokenAuthz.requireAdminToken,
        validator.validate(schemas.deleteArmyListSchema),
        armyListController.delete);

module.exports = router;