'use strict';

const battleCardService = require('../services/battleCardService');
const logger = require('../lib/logger');
const _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    const query = { }; // Default is all
    if (req.query.permanentCode) {
        query.permanentCode = req.query.permanentCode;
    }
    battleCardService.retrieveByQuery(query, function(err, documents) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get Battle Cards. Server error.');
        }
        else {
            return res.status(200).send(documents);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    battleCardService.retrieveById(req.params.battleCardId, function(err, document) {
        if (err) {
            if (err.message === battleCardService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted id');
                return res.status(400).send('Battle Card id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get Battle Card. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('Battle Card not found');
                return res.status(404).send('Battle Card not found.');
            }
            else {
                return res.status(200).send(document);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    const battleCardData = req.body;

    // Create the battle card
    battleCardService.create(battleCardData, function(err, document) {
        if (err) {
            if (err.message === battleCardService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Battle Card. Server error.");
            }
        }
        else {
            logger.info("Success: Created Battle Card " + document.displayName);
            return res.status(201).send(document);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    const battleCardData = req.body;

    battleCardService.update(req.params.battleCardId, battleCardData, function(err, document) {
        if (err) {
            if (err.message === battleCardService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted battle card id');
                return res.status(400).send('Battle Card id is badly formatted.');
            }
            else if (err.message === battleCardService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Battle Card. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('Battle Card not found');
                return res.status(404).send('Battle Card not found.');
            }
            else {
                logger.info("Success: Updated Battle Card " + document.displayName);
                return res.status(200).send(document);
            }
        }
    });
};

exports.delete = function(req, res) {
    battleCardService.deleteById(req.params.battleCardId, function(err, document) {
        if (err) {
            if (err.message === battleCardService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted battle card id');
                return res.status(400).send('Battle card id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Battle Card. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('Battle Card not found');
                return res.status(404).send('Battle Card not found.');
            }
            else {
                logger.info("Success: Deleted Battle Card " + document.displayName);
                return res.status(200).send(document);
            }
        }
    });
};

exports.import = function(req, res) {
    // Get the data from the request
    const battleCardImportRequest = req.body;

    // Create the troop type
    battleCardService.import(battleCardImportRequest, function(err, importSummary) {
        if (err) {
            if (err.message === battleCardService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === battleCardService.errors.validationError) {
                logger.warn('Troop type failed validation');
                return res.status(400).send('Unable to import Battle Cards. Battle card validation failed.');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to import Battle Cards. Server error.");
            }
        }
        else {
            logger.info("Import Battle Cards: Imported = " + importSummary.imported + ", Failed = " + importSummary.failed);
            return res.status(201).send(importSummary);
        }
    });
};

