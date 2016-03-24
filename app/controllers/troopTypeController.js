'use strict';

var troopTypeService = require('../services/troopTypeService');
var logger = require('../lib/logger');
var _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.permanentCode) {
        query.permanentCode = req.query.permanentCode;
    }
    troopTypeService.retrieveByQuery(query, function(err, documents) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get Troop Types. Server error.');
        }
        else {
            return res.status(200).send(documents);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    troopTypeService.retrieveById(req.params.categoryId, function(err, document) {
        if (err) {
            if (err.message === troopTypeService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted id');
                return res.status(400).send('Troop Type id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get Troop Type. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Troop Type not found');
                return res.status(404).send('Troop Type not found.');
            }
            else {
                return res.status(200).send(document);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    var troopTypeData = req.body;

    // Create the troop type
    troopTypeService.create(troopTypeData, function(err, document) {
        if (err) {
            if (err.message === troopTypeService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Troop Type. Server error.");
            }
        }
        else {
            logger.info("Success: Created Troop Type " + document.displayName);
            return res.status(201).send(document);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var troopTypeData = req.body;

    troopTypeService.update(req.params.troopTypeId, troopTypeData, function(err, document) {
        if (err) {
            if (err.message === troopTypeService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted troop type id');
                return res.status(400).send('Troop Type id is badly formatted.');
            }
            else if (err.message === troopTypeService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Troop Type. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('Troop Type not found');
                return res.status(404).send('Troop Type not found.');
            }
            else {
                logger.info("Success: Updated Troop Type " + document.displayName);
                return res.status(200).send(document);
            }
        }
    });
};

exports.delete = function(req, res) {
    troopTypeService.deleteById(req.params.categoryId, function(err, document) {
        if (err) {
            if (err.message === troopTypeService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted troop type id');
                return res.status(400).send('Troop type id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Troop Type. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('Troop Type not found');
                return res.status(404).send('Troop Type not found.');
            }
            else {
                logger.info("Success: Deleted Troop Type " + document.displayName);
                return res.status(200).send(document);
            }
        }
    });
};
