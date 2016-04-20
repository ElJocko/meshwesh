'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var bookController = require('../controllers/bookController');

var router = express.Router();

router.route('/v1/books')
    .get(tokenAuthz.requireAdminToken, bookController.retrieveByQuery);

module.exports = router;
