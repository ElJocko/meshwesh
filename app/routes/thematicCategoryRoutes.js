'use strict';

/**
 * Thematic Category routes module.
 * @module app/routes/thematicCategoryRoutes
 *
 * Establishes the routes for the Thematic Category resource.
 *
 */

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const validator = require('express-jsonschema');
const thematicCategoryController = require('../controllers/thematicCategoryController');
const schemas = require('./schemas/thematicCategorySchemas');

const router = express.Router();

router.route('/v1/thematicCategories')
    .get(
        tokenAuthz.allowAll,
        validator.validate(schemas.retrieveByQuery),
        thematicCategoryController.retrieveByQuery)
    .post(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.create),
        thematicCategoryController.create);

router.route('/v1/thematicCategories/:categoryId')
    .get(
        tokenAuthz.allowAll,
        validator.validate(schemas.retrieveById),
        thematicCategoryController.retrieveById)
    .put(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.update),
        thematicCategoryController.update)
    .delete(
        tokenAuthz.requireEditorRole,
        validator.validate(schemas.delete),
        thematicCategoryController.delete);

router.route('/v1/thematicCategories/:categoryId/armyLists')
    .get(
        tokenAuthz.allowAll,
        validator.validate(schemas.retrieveById),
        thematicCategoryController.retrieveArmyLists);

router.route('/v1/thematicCategoriesImport')
    .post(
        tokenAuthz.requireAdminRole,
//        validator.validate(schemas.import),
        thematicCategoryController.import);

module.exports = router;