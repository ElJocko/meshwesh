'use strict';

var allyArmyListService = require('../services/allyArmyListService');
var logger = require('../lib/logger');
var _ = require('lodash');

exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.where = { name: { like: req.query.name }};
    }
    allyArmyListService.retrieveByQueryLean(query, function(err, lists) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get ally army lists. Server error.');
        }
        else {
            return res.status(200).send(lists);
        }
    });
};

exports.retrieveById = function(req, res) {
    allyArmyListService.retrieveByIdLean(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted ally army list id');
                return res.status(400).send('Ally Army List id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get ally army list. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Ally army list not found');
                return res.status(404).send('Ally Army List not found.');
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
    allyArmyListService.create(listData, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else if (err.message === allyArmyListService.errors.referenceNotFound) {
                logger.warn('Reference not found for ' + err.parameterName);
                return res.status(400).send('Reference not found for ' + err.parameterName);
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Ally Army List. Server error.");
            }
        }
        else {
            logger.info("Success: Created ally army list " + list.name);
            return res.status(201).send(list);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var listData = req.body;

    allyArmyListService.update(req.params.listId, listData, function(err, list) {
        if (err) {
            if (err.message === allyArmyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted army list id');
                return res.status(400).send('Army List id is badly formatted.');
            }
            else if (err.message === allyArmyListService.errors.referenceNotFound) {
                logger.warn('Reference not found for ' + err.parameterName);
                return res.status(400).send('Reference not found for ' + err.parameterName);
            }
            else if (err.message === allyArmyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Ally Army List. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Ally Army list not found');
                return res.status(404).send('Ally Army List not found.');
            }
            else {
                logger.info("Success: Updated ally army list " + list.name);
                return res.status(200).send(list);
            }
        }
    });
};

exports.delete = function(req, res) {
    allyArmyListService.deleteById(req.params.listId, function(err, list) {
        if (err) {
            if (err.message === allyArmyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted ally army list id');
                return res.status(400).send('Ally Army List id is badly formatted.');
            }
            else if (err.message === allyArmyListService.errors.notFound) {
                logger.warn('Ally Army list not found');
                return res.status(404).send('Ally Army List not found.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Ally Army List. Server error.');
            }
        }
        else {
            logger.info("Success: Deleted ally army list " + list.name);
            return res.status(200).send(list);
        }
    });
};
