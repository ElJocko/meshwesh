'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var armyListController = require('../controllers/armyListController');

var router = express.Router();

router.route('/v1/armyLists')
    .get(tokenAuthz.requireAdminToken, armyListController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, armyListController.create);

router.route('/v1/armyLists/:listId')
    .get(tokenAuthz.requireAdminToken, armyListController.retrieveById)
    .put(tokenAuthz.requireAdminToken, armyListController.update)
    .delete(tokenAuthz.requireAdminToken, armyListController.delete);

module.exports = router;