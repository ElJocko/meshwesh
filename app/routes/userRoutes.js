'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var userController = require('../controllers/userController');

var router = express.Router();

router.route('/v1/users')
    .get(tokenAuthz.requireAdminToken, userController.retrieveByQuery)
    .post(tokenAuthz.requireAdminToken, userController.create);

router.route('/v1/users/:userId')
    .get(tokenAuthz.requireAdminToken, userController.retrieveById)
    .put(tokenAuthz.requireAdminToken, userController.update)
    .delete(tokenAuthz.requireAdminToken, userController.delete);

router.route('/v1/userCredentials')
    .post(userController.signIn);

module.exports = router;
