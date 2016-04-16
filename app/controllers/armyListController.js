'use strict';

var armyListService = require('../services/armyListService');
var logger = require('../lib/logger');
var _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.where = { name: { like: req.query.name }};
    }
    armyListService.retrieveByQueryLean(query, function(err, lists) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get army lists. Server error.');
        }
        else {
            return res.status(200).send(lists);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    armyListService.retrieveByIdLean(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted army list id');
                return res.status(400).send('Army List id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get army list. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Army list not found');
                return res.status(404).send('Army List not found.');
            }
            else {
                return res.status(200).send(list);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    var listData = req.body;

    // Create the list
    armyListService.create(listData, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else if (err.message === armyListService.errors.referenceNotFound) {
                logger.warn('Reference not found for ' + err.parameterName);
                return res.status(400).send('Reference not found for ' + err.parameterName);
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Army List. Server error.");
            }
        }
        else {
            logger.info("Success: Created army list " + list.name);
            return res.status(201).send(list);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var listData = req.body;

    armyListService.update(req.params.listId, listData, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted army list id');
                return res.status(400).send('Army List id is badly formatted.');
            }
            else if (err.message === armyListService.errors.referenceNotFound) {
                logger.warn('Reference not found for ' + err.parameterName);
                return res.status(400).send('Reference not found for ' + err.parameterName);
            }
            else if (err.message === armyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Army List. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Army list not found');
                return res.status(404).send('Army List not found.');
            }
            else {
                logger.info("Success: Updated army list " + list.name);
                return res.status(200).send(list);
            }
        }
    });
};

exports.delete = function(req, res) {
    armyListService.deleteById(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted army list id');
                return res.status(400).send('Army List id is badly formatted.');
            }
            else if (err.message === armyListService.errors.notFound) {
                logger.warn('Army list not found');
                return res.status(404).send('Army List not found.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Army List. Server error.');
            }
        }
        else {
            logger.info("Success: Deleted army list " + list.name);
            return res.status(200).send(list);
        }
    });
};

exports.import = function(req, res) {
    // Get the data from the request
    var armyListImportRequest = req.body;

    // Create the troop type
    armyListService.import(armyListImportRequest, function (err, importSummary) {
        if (err) {
            if (err.message === armyListService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === armyListService.errors.validationError) {
                logger.warn('Army list failed validation');
                return res.status(400).send('Unable to import Army Lists. Army list validation failed.');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to import Army Lists. Server error.");
            }
        }
        else {
            logger.info("Import Army Lists: Imported = " + importSummary.imported + ", Failed = " + importSummary.failed);
            return res.status(201).send(importSummary);
        }
    });
};

exports.importTroopOptions = function (req, res) {
    // Get the data from the request
    var troopOptionsImportRequest = req.body;

    // Create the troop type
    armyListService.importTroopOptions(troopOptionsImportRequest, function (err, importSummary) {
        if (err) {
            if (err.message === armyListService.errors.duplicateCode) {
                logger.warn('Duplicate code');
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === armyListService.errors.validationError) {
                logger.warn('Troop option failed validation');
                return res.status(400).send('Unable to import Troop Options. Troop Option validation failed.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to import Troop Options. Server error.');
            }
        }
        else {
            logger.info('Import Troop Options: Imported = ' + importSummary.importedTroopOptions + ' troop options in ' + importSummary.importedArmyLists + ' army lists, Failed = ' + importSummary.failedArmyLists + ' army lists.');
            return res.status(201).send(importSummary);
        }
    });
};