'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var troopTypeController = require('../controllers/troopTypeController');

var router = express.Router();

router.route('/v1/troopTypes')
    .get(troopTypeController.retrieveByQuery)
    .post(tokenAuthz.requireEditor, troopTypeController.create);

router.route('/v1/troopTypes/:troopTypeId')
    .get(troopTypeController.retrieveById)
    .put(tokenAuthz.requireEditor, troopTypeController.update)
    .delete(tokenAuthz.requireEditor, troopTypeController.delete);

router.route('/v1/troopTypesImport')
    .post(tokenAuthz.requireAdmin, troopTypeController.import);

module.exports = router;
