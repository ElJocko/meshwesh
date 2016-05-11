'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var thematicCategoryController = require('../controllers/thematicCategoryController');

var router = express.Router();

router.route('/v1/thematicCategories')
    .get(thematicCategoryController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, thematicCategoryController.create);

router.route('/v1/thematicCategories/:categoryId')
    .get(thematicCategoryController.retrieveById)
    .put(tokenAuthz.requireAdminToken, thematicCategoryController.update)
    .delete(tokenAuthz.requireAdminToken, thematicCategoryController.delete);

module.exports = router;