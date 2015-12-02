'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var validator = require('express-jsonschema');
var armyListController = require('../controllers/armyListController');

var router = express.Router();

// Schemas for validating requests
var retrieveByQuerySchema = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

var createArmyListSchema = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true },
            gal_id: { type: ['number', 'null'] }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

var retrieveByIdSchema = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

var updateArmyListSchema = {
    body: {
        type: 'object',
        properties: {
            id: { type: ['number', 'null'] },
            name: { type: 'string', required: true },
            gal_id: { type: ['number', 'null'] }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

var deleteArmyListSchema = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

// Routes
router.route('/v1/armyLists')
    .get(
        tokenAuthz.requireAdminToken,
        validator.validate(retrieveByQuerySchema),
        armyListController.retrieveByQuery)
    .post(
        tokenAuthz.requireAdminToken,
        validator.validate(createArmyListSchema),
        armyListController.create);

router.route('/v1/armyLists/:listId')
    .get(
        tokenAuthz.requireAdminToken,
        validator.validate(retrieveByIdSchema),
        armyListController.retrieveById)
    .put(
        tokenAuthz.requireAdminToken,
        validator.validate(updateArmyListSchema),
        armyListController.update)
    .delete(
        tokenAuthz.requireAdminToken,
        validator.validate(deleteArmyListSchema),
        armyListController.delete);

module.exports = router;