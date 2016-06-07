'use strict';

var express = require('express');
var tokenAuthz = require('../lib/tokenAuthz');
var enemyXrefController = require('../controllers/enemyXrefController');

var router = express.Router();

router.route('/v1/enemyXrefImport')
    .post(tokenAuthz.requireAdminRole, enemyXrefController.import);

module.exports = router;
