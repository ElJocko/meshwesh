'use strict';

var ArmyList = require('../models/armyListModel');
var GrandArmyList = require('../models/grandArmyListModel');
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

exports.retrieveByQuery = function(query, callback) {
    ArmyList.find(query, function(err, documents) {
        if (err) {
            return callback(err);
        }
        else {
            var objects = [];
            for (var i = 0; i < documents.length; ++i) {
                var object = documents[i].toJSON();
                object.extendedName = extendedName(object);
                objects.push(object);
            }
            return callback(null, objects);
        }
    });
};

exports.retrieveById = function(id, callback) {
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
            else {
                // Note: document is null if not found
                if (document) {
                    document.extendedName = extendedName(document);
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
    // Delete the existing documents
    ArmyList.remove({}, function(error) {
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
    });

    function importArmyList(armyListData, cb) {
        var document = new ArmyList(armyListData);
        async.waterfall([
            function(cb) {
                return cb(null, document);
            },
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

    function setGrandArmyList(document, cb) {
        var query= { listId: document.listId };
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


function extendedName(armyList) {
    var dateRangeString = dateRangeAsString(armyList.dateRanges);
    var result = armyList.name + "  " + dateRangeString;
    return result;
}

function dateRangeAsString(dateRanges) {
    // Find the earliest start and latest end dates
    var earliestStart = 9999;
    var latestEnd = -9999;

    dateRanges.map(function(dateRange) {
        earliestStart = Math.min(earliestStart, dateRange.startDate);
        latestEnd = Math.max(latestEnd, dateRange.endDate);
    });

    var dateRangeString = "";
    if (earliestStart === 9999 || latestEnd === -9999) {
        //
    }
    else if (earliestStart < 0 && latestEnd < 0) {
        dateRangeString = Math.abs(earliestStart) + " to " + Math.abs(latestEnd) + " BC";
    }
    else if (earliestStart >= 0 && latestEnd >= 0) {
        dateRangeString = earliestStart + " to " + latestEnd + " AD";
    }
    else {
        dateRangeString = Math.abs(earliestStart) + " BC to " + latestEnd + " AD";
    }

    return dateRangeString;
}