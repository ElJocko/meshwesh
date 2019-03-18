'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.route('/v1/books')
    .get(
        bookController.retrieveByQuery);

module.exports = router;
