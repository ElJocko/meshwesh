'use strict';

var thematicCategoryService = require('./thematicCategoryService');
var ArmyList = require('../models/armyListModel');
var AllyArmyList = require('../models/allyArmyListModel');
var ThematicCategory = require('../models/thematicCategoryModel');
var GrandArmyList = require('../models/grandArmyListModel');
var EnemyXref = require('../models/enemyXrefModel');
var ThematicCategoryToArmyListXref = require('../models/thematicCategoryToArmyListXrefModel');
var transform = require('../models/lib/transform');
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

var summaryFields = ['id', 'name', 'derivedData'];

exports.retrieveByQueryLean = function(query, callback) {
    ArmyList.find(query).lean().exec(function(err, leanDocs) {
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

exports.retrieveSummaryByQueryLean = function(query, callback) {
    ArmyList.find(query).lean().exec(function(err, leanDocs) {
        if (err) {
            return callback(err);
        }
        else {
            var summaryDocs = [];
            leanDocs.forEach(function(o) {
                transform.removeDatabaseArtifactsFromObject(o);
                var summary = _.pick(o, summaryFields);
                summaryDocs.push(summary);
            });
            return callback(null, summaryDocs);
        }
    });
};

function retrieveByIdLean(id, callback) {
    if (id) {
        ArmyList.findById(id).lean().exec(function(err, leanDoc) {
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
                    ArmyList.find(query).lean().exec(function(err, leanDocs) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            leanDocs.forEach(function(o) {
                                transform.removeDatabaseArtifactsFromObject(o);
                            });

                            // Find the army list that was in the request
                            var searchListIndex = _.findIndex(leanDocs, function(o) {
                                return (o.id === id);
                            });

                            // Remove the army list
                            if (searchListIndex >= 0) {
                                leanDocs.splice(searchListIndex, 1);
                            }
                            return callback(null, leanDocs);
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
                    if (item.armyList1.equals(id) && item.armyList2.equals(id)) {
                        // self-enemy, already added from documents1, ignore here
                    }
                    else {
                        armyListIds.push(item.armyList1);
                    }
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

exports.retrieveAllyOptions = function(id, callback) {
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
                    var allyOptions = [];
                    async.eachSeries(
                        document.allyOptions,
                        function(allyOption, cb) {
                            async.eachSeries(
                                allyOption.allyEntries,
                                function(allyEntry, cb) {
                                    AllyArmyList.findById(allyEntry.allyArmyList).lean().exec(function(err, leanDoc) {
                                        if (err) {
                                            return cb(err);
                                        }
                                        else if (!leanDoc) {
                                            console.log('unable to find ally army list for army list ' + document.listId + '/' + document.sublistId + '(' + allyEntry.name + ')');
                                            return cb('unable to find ally army list for ally entry');
                                        }
                                        else {
                                            // Replace the object id with the actual data
                                            allyEntry.allyArmyList = leanDoc;
                                            return cb();
                                        }
                                    });
                                },
                                function(err) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    else {
                                        return cb();
                                    }
                                }
                            )
                        },
                        function(err) {
                            if (err) {
                                return callback(err);
                            }
                            else {
                                return callback(null, document.allyOptions);
                            }
                        });
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
            return callback(null, savedDocument.toObject());
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
        // Create the army list document
        var document = new ArmyList(armyListData);
        if (!document) {
            console.log('Unable to create ArmyList document for ' + armyListData.name);
            return cb(null, { armyList: null, error: 'Unable to create ArmyList document' });
        }

        // Add thematic categories and grand army list and save
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
                return cb(null, { armyList: result.toObject(), error: null });
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
                            if (!xrefDocument) {
                                console.log('Unable to create ThematicCategoryToArmyListXref document');
                                var error = new Error('Unable to create ThematicCategoryToArmyListXref document');
                                return cb(error);
                            }

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
                console.log(err);
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
        addAllyOptionData(armyListData, function(err, armyListData) {
            if (err) {
                return cb(null, { armyList: null, error: err });
            }
            else {
                // Find the matching army list
                ArmyList.find({ listId: armyListData.listId, sublistId: armyListData.sublistId }, function(err, documents) {
                    if (err) {
                        return cb(null, { armyList: null, error: err });
                    }
                    else if (documents.length === 1) {
                        // Update the troop options and save
                        var armyList = documents[0];
                        armyList.troopOptions = armyListData.troopOptions;
                        armyList.troopEntriesForGeneral = armyListData.troopEntriesForGeneral;
                        armyList.showTroopOptionDescriptions = armyListData.showTroopOptionDescriptions;
                        armyList.status = armyListData.status;
                        armyList.allyOptions = armyListData.allyOptions;
                        armyList.save(function(err, savedArmyList) {
                            if (err) {
                                console.log('failed to update ' + armyList.name);
                                console.log(err);
                                return cb(null, { armyList: null, error: err });
                            }
                            else {
                                if (armyListData.troopOptions.length !== savedArmyList.troopOptions.length) {
                                    console.log('failed to import all troop options for ' + savedArmyList.name + '. Input = ' + armyListData.troopOptions.length + ', Saved = ' + savedArmyList.troopOptions.length);
                                }
                                return cb(null, { armyList: savedArmyList.toObject(), error: null });
                            }
                        });
                    }
                    else if (documents.length === 0) {
                        console.log('found no documents for ' + armyListData.listId + '/' + armyListData.sublistId);
                        console.log(JSON.stringify(armyListData));
                        return cb(null, { armyList: null, error: null });
                    }
                    else {
                        console.log('found multiple documents for ' + armyListData.listId + '/' + armyListData.sublistId);
                        return cb(null, { armyList: null, error: null });
                    }
                });
            }
        });
    }

    function addAllyOptionData(armyListData, cb) {
        var newAllyOptions = [];
        async.eachSeries(
            armyListData.allyOptions,
            function(allyOption, cb) {
                var newAllyOption = {
                    dateRange: allyOption.dateRange,
                    note: allyOption.note,
                    allyEntries: []
                };

                async.eachSeries(
                    allyOption.allyEntries,
                    function(allyEntry, cb) {
                        var newAllyEntry = {
                            name: allyEntry.name
                        };

                        var query = { listId: allyEntry.allyListId, sublistId: allyEntry.allySublistId };
                        AllyArmyList.find(query).lean().exec(function(err, leanDocs) {
                            if (err) {
                                console.log('Error while retrieving ally army list ' + allyEntry.allyListId + '/' + allyEntry.allySublistId + ' (' + allyEntry.name + ') for army list ' + armyListData.listId + '/' + armyListData.sublistId + ' ERROR = ' + err);
                                return cb(err);
                            }
                            else if (leanDocs.length === 0) {
                                console.log('unable to find ally army list ' + allyEntry.allyListId + '/' + allyEntry.allySublistId + ' (' + allyEntry.name + ') for army list ' + armyListData.listId + '/' + armyListData.sublistId);
                                return cb('unable to find ally army list for ally entry');
                            }
                            else {
                                newAllyEntry.allyArmyList = leanDocs[0]._id;
                                newAllyOption.allyEntries.push(newAllyEntry);
                                return cb();
                            }
                        });
                    },
                    function(err) {
                        if (err) {
                            return cb(err);
                        }
                        else {
                            newAllyOptions.push(newAllyOption);
                            return cb();
                        }
                    }
                )
            },
            function(err) {
                if (err) {
                    return cb(err);
                }
                else {
                    armyListData.allyOptions = newAllyOptions;
                    return cb(null, armyListData);
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
