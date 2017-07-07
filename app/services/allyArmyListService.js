'use strict';

var AllyArmyList = require('../models/allyArmyListModel');
var armyListService = require('./armyListService');
var transform = require('../models/lib/transform');
var async = require('async');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Document not found',
    validationError: 'AllyArmyList validation failed'
};
exports.errors = errors;

exports.retrieveByQueryLean = function(query, callback) {
    AllyArmyList.find(query).lean().exec(function(err, leanDocs) {
        if (err) {
            return callback(err);
        }
        else {
            leanDocs.forEach(function(o) {
                transform.removeDatabaseArtifactsFromObject(o);
            });
            return callback(null, leanDocs);
        }
    });
};

function retrieveByIdLean(id, callback) {
    if (id) {
        AllyArmyList.findById(id).lean().exec(function(err, leanDoc) {
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
                // Note: object is null if not found
                if (leanDoc) {
                    transform.removeDatabaseArtifactsFromObject(leanDoc);
                    return callback(null, leanDoc);
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
}
exports.retrieveByIdLean = retrieveByIdLean;

exports.create = function(data) {
    // Create the document
    const document = new AllyArmyList(data);

    const promise = new Promise(function(resolve, reject) {
        // Save the document in the database
        document.save()
            .then(savedDocument => resolve(savedDocument.toObject()))
            .catch(err => {
                if (err.name === 'MongoError' && err.code === 11000) {
                    // 11000 = Duplicate index
                    return reject(new Error(errors.duplicateName));
                }
                else {
                    return reject(err);
                }
            });
    });

    return promise;
};

exports.update = function(id, data, callback) {
    if (id) {
        AllyArmyList.findById(id, function(err, document) {
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
                        return callback(null, savedDocument.toObject());
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
        AllyArmyList.findByIdAndRemove(id, function(err, document) {
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
                    return callback(null, document.toObject());
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

exports.import = function(importRequest, callback) {
    if (importRequest.options && importRequest.options.deleteAll ) {
        // Delete the existing documents
        AllyArmyList.remove({}, function (error) {
            // Import the documents
            async.mapSeries(
                importRequest.data,
                importAllyArmyList,
                function (err, results) {
                    if (err) {
                        // TBD: organize results better
                        return callback(err);
                    }
                    else {
                        var importSummary = summarizeImport(results);
                        return callback(null, importSummary);
                    }
                }
            );
        });
    }
    else {
        // Import the documents without deleting first
        async.mapSeries(
            importRequest.data,
            importAllyArmyList,
            function (err, results) {
                if (err) {
                    // TBD: organize results better
                    return callback(err);
                }
                else {
                    var importSummary = summarizeImport(results);
                    return callback(null, importSummary);
                }
            }
        );
    }

    function importAllyArmyList(allyArmyListData, cb) {
        // Lookup the army list name (if necessary)
        lookupArmyListData(allyArmyListData, function(err, updatedData) {
            if (err) {
                console.log('Unable to lookup army list data for ally army list: ' + allyArmyListData.listId + '/' + allyArmyListData.sublistId);
                console.log(err);
                return cb(null, { allyArmyList: null, error: err });
            }
            else {
                // Create the ally army list document
                var document = new AllyArmyList(updatedData);
                if (!document) {
                    console.log('Unable to create AllyArmyList document for ' + updatedData.name);
                    return cb(null, { allyArmyList: null, error: 'Unable to create AllyArmyList document' });
                }

                document.save(function(err, savedDocument) {
                    if (err) {
                        return cb(null, { allyArmyList: null, error: err });
                    }
                    else {
                        return cb(null, { allyArmyList: savedDocument.toObject(), error: null });
                    }
                });
            }
        });
    }

    function lookupArmyListData(allyArmyListData, cb) {
        if (!allyArmyListData.name || !allyArmyListData.dateRange) {
            var query = {listId: allyArmyListData.listId, sublistId: allyArmyListData.sublistId};
            armyListService.retrieveByQueryLean(query, function (err, armyLists) {
                if (err) {
                    return cb(err, allyArmyListData);
                }
                else if (armyLists.length === 0) {
                    if (allyArmyListData.name) {
                        // Missing dateRange. Assume that null is ok.
                        return cb(null, allyArmyListData);
                    }
                    else {
                        // Missing name. This is an error.
                        return cb('army list not found', allyArmyListData);
                    }
                }
                else {
                    // Add the name
                    if (!allyArmyListData.name) {
                        allyArmyListData.name = armyLists[0].name;
                    }

                    // Add the date range
                    if (!allyArmyListData.dateRange && armyLists[0].dateRanges.length > 0) {
                        allyArmyListData.dateRange = armyLists[0].dateRanges[0];
                    }

                    // Add the object id for the army list
                    if (!allyArmyListData.armyListId) {
                        allyArmyListData.armyListId = armyLists[0].id;
                    }

                    return cb(null, allyArmyListData);
                }
            })
        }
        else {
            return cb(null, allyArmyListData);
        }
    }

    function summarizeImport(results) {
        var importCount = 0;
        var errorCount = 0;
        results.forEach(function(item) {
            if (item.allyArmyList) {
                importCount = importCount + 1;
            }
            else if (item.error) {
                errorCount = errorCount + 1;
            }
            else {
                // shouldn't reach here
            }
        });
        var summary = { imported: importCount, failed: errorCount };
        return summary;
    }
};
