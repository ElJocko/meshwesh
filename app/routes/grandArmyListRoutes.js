'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var grandArmyListController = require('../controllers/grandArmyListController');

var router = express.Router();

router.route('/v1/grandArmyLists')
    .get(grandArmyListController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, grandArmyListController.create);

    router.route('/v1/grandArmyLists/:listId')
        .get(grandArmyListController.retrieveById)
        .put(tokenAuthz.requireAdminToken, grandArmyListController.update)
        .delete(tokenAuthz.requireAdminToken, grandArmyListController.delete);

    router.route('/v1/grandArmyListsImport')
        .post(
            tokenAuthz.requireAdminToken, grandArmyListController.import);


module.exports = router;