'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const troopTypeController = require('../controllers/troopTypeController');

const router = express.Router();

router.route('/v1/troopTypes')
    .get(
        tokenAuthz.allowAll,
        troopTypeController.retrieveByQuery)
    .post(
        tokenAuthz.requireEditorRole,
        troopTypeController.create);

router.route('/v1/troopTypes/:troopTypeId')
    .get(
        troopTypeController.retrieveById)
    .put(
        tokenAuthz.requireEditorRole,
        troopTypeController.update)
    .delete(
        tokenAuthz.requireEditorRole,
        troopTypeController.delete);

router.route('/v1/troopTypesImport')
    .post(
        tokenAuthz.allowAll,
        tokenAuthz.requireAdminRole,
        troopTypeController.import);

module.exports = router;
