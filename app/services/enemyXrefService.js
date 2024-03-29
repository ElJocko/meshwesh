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

exports.getEnemies = function(armyListId, callback) {
    const enemyList = [];
    EnemyXref.find({ armyList1: armyListId }).lean().exec(function(err, enemyXrefs) {
        enemyXrefs.forEach(function(enemy) {
            enemyList.push(enemy.armyList2);
        });

        EnemyXref.find({ armyList2: armyListId }).lean().exec(function(err, enemyXrefs) {
            enemyXrefs.forEach(function(enemy) {
                if (enemy.armyList1 !== armyListId) {
                    enemyList.push(enemy.armyList1);
                }
            });

            return callback(null, enemyList);
        });
    });
};

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

    const duplicateCombination = 'Duplicate enemy combination found';

    function importEnemyXref(enemyXrefData, cb) {
        // 1. Lookup army list 1 from list id and sublist id to get object id
        // 2. Lookup army list 2
        // 3. Make sure pair doesn't exist already
        // 4. Make sure the pair overlap in time (warning only)
        // 5. Insert pair

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
                    console.log('Error: Army list 1 not found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' at row ' + enemyXrefData.index);
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
                        console.log('Error: Army list 2 not found: ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
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
                                console.log('Error: Duplicate enemy combination found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                                return cb(null, { enemyXref: null, error: duplicateCombination });
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
                                        console.log('Error: Duplicate enemy combination found: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                                        return cb(null, { enemyXref: null, error: duplicateCombination });
                                    }
                                    else {
                                        // Issue a warning if the army lists don't overlap in time
                                        const noOverlap = !dateRangesOverlap(armyList1.dateRanges, armyList2.dateRanges);
                                        if (noOverlap) {
                                            console.log('Warning: Enemies do not overlap in time: ' + enemyXrefData.armyList1.listId + enemyXrefData.armyList1.sublistId + ' ' + enemyXrefData.armyList2.listId + enemyXrefData.armyList2.sublistId + ' at row ' + enemyXrefData.index);
                                        }

                                        // Everything is set. Create the enemyXref...
                                        var document = new EnemyXref({ armyList1: armyList1._id, armyList2: armyList2._id });

                                        // Save the document in the database
                                        document.save(function(err, savedDocument) {
                                            if (err) {
                                                console.log('save error');
                                                console.log(err);
                                                return cb(null, { enemyXref: null, error: err, noOverlap });
                                            }
                                            else {
                                                return cb(null, { enemyXref: savedDocument.toObject(), error: null, noOverlap });
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
        let importCount = 0;
        let errorCount = 0;
        let overlapCount = 0;
        let duplicateCount = 0;
        results.forEach(function(item) {
            if (item.noOverlap) {
                overlapCount = overlapCount + 1;
            }

            if (item.enemyXref) {
                importCount = importCount + 1;
            }
            else if (item.error) {
                if (item.error === duplicateCombination) {
                    duplicateCount = duplicateCount + 1;
                }
                else {
                    errorCount = errorCount + 1;
                }
            }
            else {
                // shouldn't reach here
            }
        });
        var summary = { imported: importCount, failed: errorCount, duplicateCount, overlapCount };
        return summary;
    }

    function dateRangesOverlap(dateRange1, dateRange2) {
        // There must be at least one range in each array
        if (dateRange1.length === 0 || dateRange2.length === 0) {
            return false;
        }

        // Treat each set of ranges as a single span--ignore gaps
        var start1 = _.minBy(dateRange1, function(o) { return o.startDate; }).startDate;
        var end1 = _.maxBy(dateRange1, function(o) { return o.endDate; }).endDate;
        var start2 = _.minBy(dateRange2, function(o) { return o.startDate; }).startDate;
        var end2 = _.maxBy(dateRange2, function(o) { return o.endDate; }).endDate;

        return (start1 <= end2 && start2 <= end1);
    }
};
