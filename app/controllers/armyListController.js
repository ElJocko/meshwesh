'use strict';

var armyListService = require('../services/armyListService');
var logger = require('../lib/logger');
var _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.name = req.query.name;
    }
    armyListService.retrieveByQuery(query, function(err, lists) {
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
    armyListService.retrieveById(req.params.listId, function(err, list) {
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
    var listData = _.pick(req.body, ['name', 'gal_id']);

    // Validate input
    if (!listData.name) {
        logger.warn("Request missing one or more required properties.");
        return res.status(400).send("Unable to create Army List. Request missing one or more required properties.");
    }

    // Create the list
    armyListService.create(listData, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
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
    var listData = _.pick(req.body, ['name', 'gal_id']);

    armyListService.update(req.params.listId, listData, function(err, list) {
        if (err) {
            if (err.message === armyListService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted army list id');
                return res.status(400).send('Army List id is badly formatted.');
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
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Army List. Server error.');
            }
        }
        else {
            if (!list) {
                logger.warn('Army list not found');
                return res.status(404).send('Army List not found.');
            }
            else {
                logger.info("Success: Deleted army list " + list.name);
                return res.status(200).send(list);
            }
        }
    });
};
