'use strict';

var ThematicCategory = require('../models/thematicCategoryModel');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Document not found'
};
exports.errors = errors;

exports.retrieveByQuery = function(query, callback) {
    ThematicCategory.find(query, function(err, documents) {
        if (err) {
            return callback(err);
        }
        else {
            var objects = [];
            for (var i = 0; i < documents.length; ++i) {
                var object = documents[i].toJSON();
                objects.push(object);
            }
            return callback(null, objects);
        }
    });
};

exports.retrieveById = function(id, callback) {
    if (id) {
        ThematicCategory.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                // Note: document is null if not found
                if (document) {
                    return callback(null, document.toJSON());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.create = function(data, callback) {
    // Create the document
    var document = new ThematicCategory(data);

    // Save the document in the database
    document.save(function(err, savedDocument) {
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
            return callback(null, savedDocument.toJSON());
        }
    });
};

exports.update = function(id, data, callback) {
    if (id) {
        ThematicCategory.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else if (!document) {
                // document not found
                return callback(null);
            }
            else {
                // Copy data to found document and save
                _.assign(document, data);
                document.save(function(err, savedDocument) {
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
                        return callback(null, savedDocument.toJSON());
                    }
                });
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.deleteById = function(id, callback) {
    if (id) {
        ThematicCategory.findByIdAndRemove(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                //Note: document is null if not found
                if (document) {
                    return callback(null, document.toJSON());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};
