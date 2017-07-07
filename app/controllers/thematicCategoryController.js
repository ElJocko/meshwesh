'use strict';

/**
 * Thematic Category controller module
 * @module app/controllers/thematicCategoryController
 *
 * Implements the HTTP actions for the Thematic Category resource.
 *
 */

const thematicCategoryService = require('../services/thematicCategoryService');
const logger = require('../lib/logger');
const _ = require('lodash');

exports.retrieveByQuery = function(req, res) {
    const query = { }; // Default is all
    if (req.query.name) {
        query.name = req.query.name;
    }
    thematicCategoryService.retrieveByQuery(query, function(err, categories) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get Thematic Categories. Server error.');
        }
        else {
            return res.status(200).send(categories);
        }
    });
};

/**
 * Retrieve a single Thematic Category using its id
 *
 * @param {Object} req - Middleware request object
 * @param {Object} res - Middleware result object
 *
 */

exports.retrieveById = function(req, res) {
    thematicCategoryService.retrieveById(req.params.categoryId, function(err, category) {
        if (err) {
            if (err.message === thematicCategoryService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted category id');
                return res.status(400).send('Category id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get Thematic Category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Thematic Category not found');
                return res.status(404).send('Thematic Category not found.');
            }
            else {
                return res.status(200).send(category);
            }
        }
    });
};

exports.retrieveArmyLists = function(req, res) {
    thematicCategoryService.retrieveArmyLists(req.params.categoryId, function(err, armyLists) {
        if (err) {
            if (err.message === thematicCategoryService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted category id');
                return res.status(400).send('Category id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get army lists. Server error.');
            }
        }
        else {
            return res.status(200).send(armyLists);
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    const categoryData = _.pick(req.body, 'name');

    // Validate input
    if (!categoryData.name) {
        logger.warn("Request missing one or more required properties.");
        return res.status(400).send("Unable to create Thematic Category. Request missing one or more required properties.");
    }

    // Create the category
    thematicCategoryService.create(categoryData, function(err, category) {
        if (err) {
            if (err.message === thematicCategoryService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create Thematic Category. Server error.");
            }
        }
        else {
            logger.info("Success: Created Thematic Category " + category.name);
            return res.status(201).send(category);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    const categoryData = _.pick(req.body, 'name');

    // Validate input
    if (!categoryData.name) {
        logger.warn("Request missing one or more required properties.");
        return res.status(400).send("Unable to create Thematic Category. Request missing one or more required properties.");
    }

    thematicCategoryService.update(req.params.categoryId, categoryData, function(err, category) {
        if (err) {
            if (err.message === thematicCategoryService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted category id');
                return res.status(400).send('Category id is badly formatted.');
            }
            else if (err.message === thematicCategoryService.errors.duplicateName) {
                logger.warn("Duplicate name");
                return res.status(409).send('Duplicate name');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update Thematic Category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Category not found');
                return res.status(404).send('Thematic Category not found.');
            }
            else {
                logger.info("Success: Updated Thematic Category " + category.name);
                return res.status(200).send(category);
            }
        }
    });
};

exports.delete = function(req, res) {
    thematicCategoryService.deleteById(req.params.categoryId, function(err, category) {
        if (err) {
            if (err.message === thematicCategoryService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted category id');
                return res.status(400).send('Category id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete Thematic Category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Category not found');
                return res.status(404).send('Thematic Category not found.');
            }
            else {
                logger.info("Success: Deleted Thematic Category " + category.name);
                return res.status(200).send(category);
            }
        }
    });
};

exports.import = function(req, res) {
    // Get the data from the request
    const thematicCategoryImportRequest = req.body;

    thematicCategoryService.import(thematicCategoryImportRequest, function(err, importSummary) {
        if (err) {
            if (err.message === thematicCategoryService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === thematicCategoryService.errors.validationError) {
                logger.warn('Thematic Category failed validation');
                return res.status(400).send('Unable to import Thematic Categories. Thematic Category validation failed.');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to import Thematic Categories. Server error.");
            }
        }
        else {
            logger.info("Import Thematic Categories: Imported = " + importSummary.imported + ", Failed = " + importSummary.failed);
            return res.status(201).send(importSummary);
        }
    });
};
