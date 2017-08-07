'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var validator = require('express-jsonschema');
var schemas = require('./schemas/userSchemas');
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
    .post(
        validator.validate(schemas.signIn),
        userController.signIn);

module.exports = router;
