'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var grandArmyListController = require('../controllers/grandArmyListController');

var router = express.Router();

router.route('/v1/grandArmyLists')
    .get(tokenAuthz.requireAdminToken, grandArmyListController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, grandArmyListController.create);

    router.route('/v1/grandArmyLists/:listId')
        .get(tokenAuthz.requireAdminToken, grandArmyListController.retrieveById)
        .put(tokenAuthz.requireAdminToken, grandArmyListController.update)
        .delete(tokenAuthz.requireAdminToken, grandArmyListController.delete);

module.exports = router;