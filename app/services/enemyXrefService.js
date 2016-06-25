'use strict';

var EnemyXref = require('../models/enemyXrefModel');
var ArmyList = require('../models/armyListModel');
var async = require('async');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateCode: 'Duplicate code',
    notFound: 'Document not found',
    validationError: 'Enemy Xref validation failed'
};
exports.errors = errors;

exports.import = function(importRequest, callback) {

    if (importRequest.options && importRequest.options.deleteAll ) {
        async.series(
            [
                removeDocuments,
                importDocuments
            ],
            function (err, results) {
                if (err) {
                    return callback(err);
                }
                else {
                    var importSummary = results[1];
                    return callback(null, importSummary);
                }
            }
        );
    }
    else {
        importDocuments(function(err, importSummary) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, importSummary);
            }
        });
    }


    function removeDocuments(cb) {
        EnemyXref.remove({}, function(err) {
            cb(err, null);
        });
    }

    function importDocuments(cb) {
        async.mapSeries(
            importRequest.data,
            importEnemyXref,
            function(err, results) {
                if (err) {
                    // TBD: organize results better
                    return cb(err, null);
                }
                else {
                    var importSummary = summarizeImport(results);
                    return cb(null, importSummary);
                }
            }
        );
    }

    function importEnemyXref(enemyXrefData, cb) {
        // 1. Lookup army list 1 from list id and sublist id to get object id
        // 2. Lookup army list 2
        // 3. Make sure pair doesn't exist already (TBD)
        // 4. Insert pair

        var query = {
            listId: enemyXrefData.armyList1.listId,
            sublistId: enemyXrefData.armyList1.sublistId
        };
        ArmyList.findOne(query).lean().exec(function(err, armyList1) {
            if (err) {
                return cb(err);
            }
            else {
                if (!armyList1) {
                    console.log('Army list 1 not found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' at row ' + enemyXrefData.index);
                    return cb(null, { enemyXref: null, error: 'Army List 1 Not found' });
                }
                query = {
                    listId: enemyXrefData.armyList2.listId,
                    sublistId: enemyXrefData.armyList2.sublistId
                };
                ArmyList.findOne(query).lean().exec(function(err, armyList2) {
                    if (err) {
                        return cb(err);
                    }
                    else if (!armyList2) {
                        console.log('Army list 2 not found: ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                        return cb(null, { enemyXref: null, error: 'Army List 2 Not found' });
                    }
                    else {
                        // Check to make sure the combination doesn't already exist
                        query = {
                            armyList1: armyList1._id,
                            armyList2: armyList2._id
                        };
                        EnemyXref.findOne(query).lean().exec(function(err, xref1) {
                            if (err) {
                                return cb(err);
                            }
                            else if (xref1) {
                                console.log('Duplicate enemy combination found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                                return cb(null, { enemyXref: null, error: 'Duplicate enemy combination found' });
                            }
                            else {
                                query = {
                                    armyList1: armyList2._id,
                                    armyList2: armyList1._id
                                };
                                EnemyXref.findOne(query).lean().exec(function(err, xref1) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    else if (xref1) {
                                        console.log('Duplicate enemy combination found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                                        return cb(null, { enemyXref: null, error: 'Duplicate enemy combination found' });
                                    }
                                    else {
                                        // Everything is set. Create the enemyXref...
                                        var document = new EnemyXref({ armyList1: armyList1._id, armyList2: armyList2._id });

                                        // Save the document in the database
                                        document.save(function(err, savedDocument) {
                                            if (err) {
                                                console.log('save error');
                                                console.log(err);
                                                return cb(null, { enemyXref: null, error: err });
                                            }
                                            else {
                                                return cb(null, { enemyXref: savedDocument.toJSON(), error: null });
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }
                });

            }
        });
    }

    function summarizeImport(results) {
        var importCount = 0;
        var errorCount = 0;
        results.forEach(function(item) {
            if (item.enemyXref) {
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
