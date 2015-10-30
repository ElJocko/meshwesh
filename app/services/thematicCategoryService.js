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
    ThematicCategory.findAll({ }).then(function(categories) {
        return callback(null, categories);
    });
};

exports.retrieveById = function(categoryId, callback) {
    if (categoryId) {
        ThematicCategory.findById(categoryId).then(function(category) {
            return callback(null, category);
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'categoryId';
        return callback(error);
    }
};

exports.create = function(categoryData, callback) {
    // Insert the row
    ThematicCategory.create({ name: categoryData.name })
        .then(function(savedCategory) {
            return callback(null, savedCategory);
        })
        .catch(function(err) {
            return callback(err);
        });
};

exports.update = function(categoryId, categoryData, callback) {
    if (categoryId) {
        ThematicCategory.findById(categoryId)
            .then(function(category) {
                _.assign(category, categoryData);
                category.save()
                    .then(function(err) {
                        return callback(null, category);
                    });
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
        ThematicCategory.findById(categoryId)
            .then(function(category) {
                category.destroy().then(function() {
                    return callback(null, category);
                });
            });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'categoryId';
        return callback(error);
    }
};