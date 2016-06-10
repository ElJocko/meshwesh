'use strict';

var thematicCategoryService = require('./thematicCategoryService');
var ArmyList = require('../models/armyListModel');
var ThematicCategory = require('../models/thematicCategoryModel');
var GrandArmyList = require('../models/grandArmyListModel');
var EnemyXref = require('../models/enemyXrefModel');
var ThematicCategoryToArmyListXref = require('../models/thematicCategoryToArmyListXrefModel');
var transform = require('../models/transform');
var async = require('async');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Document not found',
    validationError: 'ArmyList validation failed'
};
exports.errors = errors;

exports.retrieveByQueryLean = function(query, callback) {
    ArmyList.find(query).lean().exec(function(err, documents) {
        if (err) {
            return callback(err);
        }
        else {
            for (var i = 0; i < documents.length; ++i) {
                transform.removeDatabaseArtifacts(documents[i]);
            }
            return callback(null, documents);
        }
    });
};

function retrieveByIdLean(id, callback) {
    if (id) {
        ArmyList.findById(id).lean().exec(function(err, document) {
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
                    transform.removeDatabaseArtifacts(document);
                    return callback(null, document);
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

exports.retrieveAssociatedArmyLists = function(id, callback) {
    if (id) {
        ArmyList.findById(id).lean().exec(function(err, document) {
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
                    var query = { listId: document.listId };
                    ArmyList.find(query).lean().exec(function(err, documents) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            var searchListIndex = -1;
                            for (var i = 0; i < documents.length; ++i) {
                                if (documents[i]._id.equals(document._id)) {
                                    searchListIndex = i;
                                }
                                transform.removeDatabaseArtifacts(documents[i]);
                            }

                            // Remove the list that we're seaching on
                            if (searchListIndex >= 0) {
                                var removedArmyList = documents.splice(searchListIndex, 1);
                                console.log(removedArmyList.name);
                            }
                            return callback(null, documents);
                        }
                    });
                }
                else {
                    return callback(null, []);
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

exports.retrieveEnemyArmyLists = function(id, callback) {
    if (id) {
        var query1 = { armyList1: id };
        EnemyXref.find(query1).lean().exec(function(err, documents1) {
            var query2 = { armyList2: id };
            EnemyXref.find(query2).lean().exec(function(err, documents2) {
                // Extract the full list of army list ids
                var armyListIds = [];
                documents1.forEach(function(item) {
                    armyListIds.push(item.armyList2);
                });
                documents2.forEach(function(item) {
                    armyListIds.push(item.armyList1);
                });

                async.mapSeries(
                    armyListIds,
                    retrieveByIdLean,
                    function(err, results) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, results);
                        }
                    }
                );

            });
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.retrieveThematicCategories = function(id, callback) {
    if (id) {
        var query = { armyList: id };
        ThematicCategoryToArmyListXref.find(query).lean().exec(function(err, documents) {
                async.mapSeries(
                    documents,
                    function(xref, cb) {
                        thematicCategoryService.retrieveById(xref.thematicCategory, function(err, thematicCategory) {
                            if (err) {
                                return cb(err);
                            }
                            else {
                                return cb(null, thematicCategory);
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
    var document = new ArmyList(data);

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
        ArmyList.findById(id, function(err, document) {
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
        ArmyList.findByIdAndRemove(id, function(err, document) {
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

exports.import = function(importRequest, callback) {
    if (importRequest.options && importRequest.options.deleteAll ) {
        // Delete the existing documents
        ArmyList.remove({}, function (error) {
            // Delete the ThematicCategory - ArmyList Xref records
            ThematicCategoryToArmyListXref.remove({}, function (error) {
                // Import the documents
                async.mapSeries(
                    importRequest.data,
                    importArmyList,
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
        });
    }
    else {
        // Import the documents without deleting first
        async.mapSeries(
            importRequest.data,
            importArmyList,
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

    function importArmyList(armyListData, cb) {
        var document = new ArmyList(armyListData);
        async.waterfall([
            function(cb) {
                // initialize the waterfall
                return cb(null, document, armyListData.thematicCategories);
            },
            setThematicCategories,
            setGrandArmyList,
            saveDocument
        ],
        function(err, result) {
            if (err) {
                return cb(null, { armyList: null, error: err });
            }
            else {
                return cb(null, { armyList: result.toJSON(), error: null });
            }
        });
    }

    function setThematicCategories(armyList, thematicCategories, cb) {
        async.eachSeries(
            thematicCategories,
            function(item, cb) {
                var query = { name: item };
                ThematicCategory.findOne(query, function(err, thematicCategory) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        if (thematicCategory) {
                            var xrefData = {
                                thematicCategory: thematicCategory.id,
                                armyList: armyList.id
                            };
                            var xrefDocument = new ThematicCategoryToArmyListXref(xrefData);
                            xrefDocument.save(function(err, savedDocument) {
                                if (err) {
                                    if (err.name === 'MongoError' && err.code === 11000) {
                                        // 11000 = Duplicate index
                                        var error = new Error(errors.duplicateCode);
                                        return cb(error);
                                    }
                                    else {
                                        return cb(err);
                                    }
                                }
                                else {
                                    return cb(null);
                                }
                            });
                        }
                        else {
                            console.log('thematic category not found: ' + item);
                            return cb(null);
                        }
                    }
                });

            },
            function(err) {
                cb(err, armyList);
            });
    }

    function setGrandArmyList(document, cb) {
        var query = { listId: document.listId };
        GrandArmyList.find(query, function(err, documents) {
            if (err) {
                return cb(err);
            }
            else {
                if (documents.length > 0) {
                    var grandArmyList = documents[0];
                    document.grandArmyList = grandArmyList._id;
                }
                return cb(null, document);
            }
        });
    }

    function saveDocument(document, cb) {
        // Save the document in the database
        document.save(function(err, savedDocument) {
            if (err) {
                console.log('failed to import ' + document.name);
//                console.log(err);
                if (err.name === 'MongoError' && err.code === 11000) {
                    // 11000 = Duplicate index
                    var error = new Error(errors.duplicateCode);
                    return cb(error);
                }
                else {
                    return cb(err);
                }
            }
            else {
                return cb(null, savedDocument);
            }
        });
    }

    function summarizeImport(results) {
        var importCount = 0;
        var errorCount = 0;
        results.forEach(function(item) {
            if (item.armyList) {
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

exports.importTroopOptions = function(importRequest, callback) {
    // Import the documents
    async.mapSeries(
        importRequest.data,
        importArmyList,
        function(err, results) {
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

    function importArmyList(armyListData, cb) {
        // Find the matching army list
        ArmyList.find({ listId: armyListData.listId, sublistId: armyListData.sublistId }, function(err, documents) {
            if (err) {
                return cb(null, { armyList: null, error: err });
            }
            else if (documents.length === 1) {
                // Update the troop options and save
                var armyList = documents[0];
                armyList.troopOptions = armyListData.troopOptions;
                armyList.save(function(err, savedArmyList) {
                    if (err) {
                        console.log('failed to update ' + armyList.name);
                        return cb(null, { armyList: null, error: err });
                    }
                    else {
                        if (armyListData.troopOptions.length !== savedArmyList.troopOptions.length) {
                            console.log('failed to import all troop options for ' + savedArmyList.name + '. Input = ' + armyListData.troopOptions.length + ', Saved = ' + savedArmyList.troopOptions.length);
                        }
                        return cb(null, { armyList: savedArmyList.toJSON(), error: null });
                    }
                });
            }
            else if (documents.length === 0) {
                console.log('found no documents for ' + armyListData.listId + '/' + armyListData.sublistId);
                return cb(null, { armyList: null, error: null });
            }
            else {
                console.log('found multiple documents for ' + armyListData.listId + '/' + armyListData.sublistId);
                return cb(null, { armyList: null, error: null });
            }
        });
    }

    function summarizeImport(results) {
        var importCount = 0;
        var troopOptionImportCount = 0;
        var errors = [];
        results.forEach(function(item) {
            if (item.armyList) {
                importCount = importCount + 1;
                troopOptionImportCount = troopOptionImportCount + item.armyList.troopOptions.length;
            }
            else if (item.error) {
                errors.push(item.error);
            }
            else {
                // shouldn't reach here
            }
        });
        var summary = { importedArmyLists: importCount, importedTroopOptions: troopOptionImportCount, failedArmyLists: errors.length, errors: errors };
        return summary;
    }
};
