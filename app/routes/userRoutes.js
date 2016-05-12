'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var userController = require('../controllers/userController');

var router = express.Router();

router.route('/v1/users')
    .get(tokenAuthz.requireAdmin, userController.retrieveByQuery)
    .post(tokenAuthz.requireAdmin, userController.create);

router.route('/v1/users/:userId')
    .get(tokenAuthz.requireAdmin, userController.retrieveById)
    .put(tokenAuthz.requireAdmin, userController.update)
    .delete(tokenAuthz.requireAdmin, userController.delete);

router.route('/v1/userCredentials')
    .post(userController.signIn);

module.exports = router;
