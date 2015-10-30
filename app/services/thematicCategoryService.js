'use strict';

var models = require('../models');
var tokenAuthz = require('../lib/tokenAuthz');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    categoryNotFound: 'Category not found'
};
exports.errors = errors;

var ThematicCategory = models.ThematicCategoryModel;

exports.retrieveByQuery = function(query, callback) {
    ThematicCategory.find(query, function(err, categories) {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, categories);
        }
    });
};

exports.retrieveById = function(categoryId, callback) {
    if (categoryId) {
        ThematicCategory.findById(categoryId, function(err, category) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'categoryId';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                //Note: category is null if not found
                return callback(null, category);
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'categoryId';
        return callback(error);
    }
};

exports.create = function(categoryData, callback) {
    // Create the document
    var category = new ThematicCategory(categoryData);

    // Save the category in the database
    category.save(function(err, savedCategory) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // 11000 = Duplicate index
                var error = new Error(errors.duplicateName);
                return callback(error);
            }
            else {
                return callback(err);
            }
        }
        else {
            return callback(null, savedCategory);
        }
    });
};

exports.update = function(categoryId, categoryData, callback) {
    if (categoryId) {
        ThematicCategory.findById(categoryId, function(err, category) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'categoryId';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else if (!category) {
                // Category not found
                return callback(null);
            }
            else {
                // Copy data to found category and save
                _.assign(category, categoryData);
                category.save(function(err) {
                    if (err) {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            // 11000 = Duplicate index
                            var error = new Error(errors.duplicateName);
                            return callback(error);
                        }
                        else {
                            return callback(err);
                        }
                    }
                    else {
                        return callback(null, category);
                    }
                });
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'categoryId';
        return callback(error);
    }
};

exports.deleteById = function(categoryId, callback) {
    if (categoryId) {
        ThematicCategory.findByIdAndRemove(categoryId, function(err, category) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'categoryId';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                //Note: category is null if not found
                return callback(null, category);
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'categoryId';
        return callback(error);
    }
};