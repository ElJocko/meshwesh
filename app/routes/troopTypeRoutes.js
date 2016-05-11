'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var troopTypeController = require('../controllers/troopTypeController');

var router = express.Router();

router.route('/v1/troopTypes')
    .get(troopTypeController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, troopTypeController.create);

router.route('/v1/troopTypes/:troopTypeId')
    .get(troopTypeController.retrieveById)
    .put(tokenAuthz.requireAdminToken, troopTypeController.update)
    .delete(tokenAuthz.requireAdminToken, troopTypeController.delete);

router.route('/v1/troopTypesImport')
    .post(tokenAuthz.requireAdminToken, troopTypeController.import);

module.exports = router;
