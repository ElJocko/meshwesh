'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var troopTypeController = require('../controllers/troopTypeController');

var router = express.Router();

router.route('/v1/troopTypes')
    .get(troopTypeController.retrieveByQuery)
    .post(tokenAuthz.requireEditorRole, troopTypeController.create);

router.route('/v1/troopTypes/:troopTypeId')
    .get(troopTypeController.retrieveById)
    .put(tokenAuthz.requireEditorRole, troopTypeController.update)
    .delete(tokenAuthz.requireEditorRole, troopTypeController.delete);

router.route('/v1/troopTypesImport')
    .post(tokenAuthz.requireAdminRole, troopTypeController.import);

module.exports = router;
