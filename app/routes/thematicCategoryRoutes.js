'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var thematicCategoryController = require('../controllers/thematicCategoryController');

var router = express.Router();

router.route('/v1/thematicCategories')
    .get(tokenAuthz.requireAdminToken, thematicCategoryController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, thematicCategoryController.create);

router.route('/v1/thematicCategories/:categoryId')
    .get(tokenAuthz.requireAdminToken, thematicCategoryController.retrieveById)
    .put(tokenAuthz.requireAdminToken, thematicCategoryController.update)
    .delete(tokenAuthz.requireAdminToken, thematicCategoryController.delete);

module.exports = router;