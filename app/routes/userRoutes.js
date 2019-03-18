'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const validator = require('express-jsonschema');
const schemas = require('./schemas/userSchemas');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/v1/users')
    .get(
        tokenAuthz.requireAdminToken,
        userController.retrieveByQuery)
    .post(
        tokenAuthz.requireAdminToken,
        userController.create);

router.route('/v1/users/:userId')
    .get(
        tokenAuthz.requireAdminToken,
        userController.retrieveById)
    .put(
        tokenAuthz.requireAdminToken,
        userController.update)
    .delete(
        tokenAuthz.requireAdminToken,
        userController.delete);

router.route('/v1/userCredentials')
    .post(
        validator.validate(schemas.signIn),
        userController.signIn);

module.exports = router;
