'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var troopTypeController = require('../controllers/troopTypeController');

var router = express.Router();

router.route('/v1/troopTypes')
    .get(tokenAuthz.requireAdminToken, troopTypeController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, troopTypeController.create);

router.route('/v1/troopTypes/:troopTypeId')
    .get(tokenAuthz.requireAdminToken, troopTypeController.retrieveById)
    .put(tokenAuthz.requireAdminToken, troopTypeController.update)
    .delete(tokenAuthz.requireAdminToken, troopTypeController.delete);

router.route('/v1/troopTypesImport')
    .post(tokenAuthz.requireAdminToken, troopTypeController.import);

module.exports = router;
