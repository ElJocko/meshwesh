'use strict';

var grandArmyListService = require('../services/grandArmyListService');
var logger = require('../lib/logger');
var _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.name = req.query.name;
    }
    grandArmyListService.retrieveByQuery(query, function(err, lists) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get grand army lists. Server error.');
        }
        else {
            return res.status(200).send(lists);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    grandArmyListService.retrieveById(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === grandArmyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted grand army list id');
                return res.status(400).send('Grand Army List id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get grand army list. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Grand army list not found');
                return res.status(404).send('Grand Army List not found.');
            }
            else {
                return res.status(200).send(list);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    var listData = _.pick(req.body, 'name');

    // Validate input
    if (!listData.name) {
        logger.warn("Request missing one or more required properties.");
        return res.status(400).send("Unable to create Grand Army List. Request missing one or more required properties.");
    }

    // Create the list
    grandArmyListService.create(listData, function(err, list) {
        if (err) {
            if (err.message === grandArmyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Grand Army List. Server error.");
            }
        }
        else {
            logger.info("Success: Created grand army list " + list.name);
            return res.status(201).send(list);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var listData = _.pick(req.body, 'name');

    grandArmyListService.update(req.params.listId, listData, function(err, list) {
        if (err) {
            if (err.message === grandArmyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted grand army list id');
                return res.status(400).send('Grand Army List id is badly formatted.');
            }
            else if (err.message === grandArmyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Grand Army List. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Grand army list not found');
                return res.status(404).send('Grand Army List not found.');
            }
            else {
                logger.info("Success: Updated grand army list " + list.name);
                return res.status(200).send(list);
            }
        }
    });
};

exports.delete = function(req, res) {
    grandArmyListService.deleteById(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === grandArmyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted grand army list id');
                return res.status(400).send('Grand Army List id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Grand Army List. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Grand army list not found');
                return res.status(404).send('Grand Army List not found.');
            }
            else {
                logger.info("Success: Deleted grand army list " + list.name);
                return res.status(200).send(list);
            }
        }
    });
};

exports.import = function(req, res) {
    // Get the data from the request
    var grandArmyListImportRequest = req.body;

    // Create the troop type
    grandArmyListService.import(grandArmyListImportRequest, function(err, importSummary) {
        if (err) {
            if (err.message === grandArmyListService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === grandArmyListService.errors.validationError) {
                logger.warn('Grand Army list failed validation');
                return res.status(400).send('Unable to import Grand Army Lists. Grand Army list validation failed.');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to import Grand Army Lists. Server error.");
            }
        }
        else {
            logger.info("Success: Imported " + importSummary.imported + " Grand Army Lists");
            return res.status(201).send(importSummary);
        }
    });
};
