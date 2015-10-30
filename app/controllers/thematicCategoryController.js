'use strict';

var thematicCategoryService = require('../services/thematicCategoryService');
var logger = require('../lib/logger');
var _ = require('lodash');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.name = req.query.name;
    }
    thematicCategoryService.retrieveByQuery(query, function(err, categories) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get thematic categories. Server error.');
        }
        else {
            return res.status(200).send(categories);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    thematicCategoryService.retrieveById(req.params.categoryId, function(err, category) {
        if (err) {
            if (err.message === thematicCategoryService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted category id');
                return res.status(400).send('Category id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Category not found');
                return res.status(404).send('Category not found.');
            }
            else {
                return res.status(200).send(category);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    var categoryData = _.pick(req.body, 'name');

    // Validate input
    if (!categoryData.name) {
        logger.warn("Request missing one or more required properties.");
        return res.status(400).send("Unable to create category. Request missing one or more required properties.");
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
                return res.status(500).send("Unable to create category. Server error.");
            }
        }
        else {
            logger.info("Success: Created category " + category.name);
            return res.status(201).send(category);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var categoryData = _.pick(req.body, 'name');

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
                return res.status(500).send('Unable to update category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Category not found');
                return res.status(404).send('Category not found.');
            }
            else {
                logger.info("Success: Updated category " + category.name);
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
                return res.status(500).send('Unable to delete category. Server error.');
            }
        }
        else {
            if (!category) {
                logger.warn('Category not found');
                return res.status(404).send('Category not found.');
            }
            else {
                logger.info("Success: Deleted category " + category.name);
                return res.status(200).send(category);
            }
        }
    });
};
