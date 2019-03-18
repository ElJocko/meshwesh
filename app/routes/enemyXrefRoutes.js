'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const enemyXrefController = require('../controllers/enemyXrefController');

const router = express.Router();

router.route('/v1/enemyXrefImport')
    .post(
        tokenAuthz.requireAdminRole,
        enemyXrefController.import);

module.exports = router;
