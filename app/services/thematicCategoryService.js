'use strict';

const ThematicCategory = require('../models/thematicCategoryModel');
const ThematicCategoryToArmyListXref = require('../models/thematicCategoryToArmyListXrefModel');
const armyListService = require('./armyListService');
const async = require('async');
const _ = require('lodash');

const errors = {
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
            const objects = [];
            for (let i = 0; i < documents.length; ++i) {
                const object = documents[i].toObject();
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
                    const error = new Error(errors.badlyFormattedParameter);
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
                    return callback(null, document.toObject());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.retrieveArmyLists = function(id, callback) {
    if (id) {
        const query = { thematicCategory: id };
        ThematicCategoryToArmyListXref.find(query).lean().exec(function(err, documents) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                async.mapSeries(
                    documents,
                    function(xref, cb) {
                        armyListService.retrieveByIdLean(xref.armyList, function(err, armyList) {
                            if (err) {
                                return cb(err);
                            }
                            else {
                                return cb(null, armyList);
                            }
                        })
                    },
                    function(err, results) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, results);
                        }
                    }
                );
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.create = function(data, callback) {
    // Create the document
    const document = new ThematicCategory(data);

    // Save the document in the database
    document.save(function(err, savedDocument) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // 11000 = Duplicate index
                const error = new Error(errors.duplicateName);
                return callback(error);
            }
            else {
                return callback(err);
            }
        }
        else {
            return callback(null, savedDocument.toObject());
        }
    });
};

exports.update = function(id, data, callback) {
    if (id) {
        ThematicCategory.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
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
                            const error = new Error(errors.duplicateName);
                            return callback(error);
                        }
                        else {
                            return callback(err);
                        }
                    }
                    else {
                        return callback(null, savedDocument.toObject());
                    }
                });
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.deleteById = function(id, callback) {
    if (id) {
        ThematicCategory.findByIdAndRemove(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
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
                    return callback(null, document.toObject());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.import = function(thematicCategories, callback) {
    // Delete the existing documents
    ThematicCategory.remove({}, function(error) {
        // Import the documents
        async.mapSeries(
            thematicCategories,
            importThematicCategory,
            function(err, results) {
                if (err) {
                    // TBD: organize results better
                    return callback(err);
                }
                else {
                    const importSummary = summarizeImport(results);
                    return callback(null, importSummary);
                }
            }
        );
    });

    function importThematicCategory(thematicCategory, cb) {
        const document = new ThematicCategory(thematicCategory);

        // Save the document in the database
        document.save(function(err, savedDocument) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    // 11000 = Duplicate index
                    const error = new Error(errors.duplicateCode);
                    return cb(null, { thematicCategory: null, error: error });
                }
                else {
                    return cb(null, { thematicCategory: null, error: err });
                }
            }
            else {
                return cb(null, { thematicCategory: savedDocument.toObject(), error: null });
            }
        });
    }

    function summarizeImport(results) {
        let importCount = 0;
        let errorCount = 0;
        results.forEach(function(item) {
            if (item.thematicCategory) {
                importCount = importCount + 1;
            }
            else if (item.error) {
                errorCount = errorCount + 1;
            }
            else {
                // shouldn't reach here
            }
        });
        const summary = { imported: importCount, failed: errorCount };
        return summary;
    }
};



