'use strict';

const express = require('express');
const tokenAuthz = require('../lib/tokenAuthz');
const battleCardController = require('../controllers/battleCardController');

const router = express.Router();

router.route('/v1/battleCards')
    .get(
        tokenAuthz.allowAll,
        battleCardController.retrieveByQuery)
    .post(
        tokenAuthz.requireEditorRole,
        battleCardController.create);

router.route('/v1/battleCards/:battleCardId')
    .get(
        battleCardController.retrieveById)
    .put(
        tokenAuthz.requireEditorRole,
        battleCardController.update)
    .delete(
        tokenAuthz.requireEditorRole,
        battleCardController.delete);

router.route('/v1/battleCardsImport')
    .post(
        tokenAuthz.allowAll,
        tokenAuthz.requireAdminRole,
        battleCardController.import);

module.exports = router;
