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
    // Delete the existing documents
    EnemyXref.remove({}, function(error) {
        // Import the documents
        async.mapSeries(
            importRequest.data,
            importEnemyXref,
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
    });

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
                    console.log('Army list 1 not found: ' + enemyXrefData.armyList1.listId + '/' + enemyXrefData.armyList1.sublistId);
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
                        console.log('Army list 2 not found: ' + enemyXrefData.armyList2.listId + '/' + enemyXrefData.armyList2.sublistId);
                        return cb(null, { enemyXref: null, error: 'Army List 2 Not found' });
                    }
                    else {
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
