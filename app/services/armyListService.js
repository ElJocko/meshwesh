'use strict';

var models = require('../models');
var tokenAuthz = require('../lib/tokenAuthz');
var _ = require('lodash');
var async = require('async');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Not found',
    referenceNotFound: 'Reference not found'
};
exports.errors = errors;

var armyListModel = models.armyListModel;
var armyDateRangeModel = models.armyDateRangeModel;

// Treat the army list as a single object that resides in multiple tables.

exports.retrieveByQuery = function(query, callback) {
    armyListModel.findAll(query)
        .then(function(lists) {
            return callback(null, lists);
        });
};

exports.retrieveById = function(listId, callback) {
    if (!listId) {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }

    armyListModel.findById(listId)
        .then(function(armyList) {
            return callback(null, armyList);
        });
};

exports.create = function(listData, callback) {
    // Insert a row in the army_list table
    armyListModel.create({ name: listData.name, gal_id: listData.gal_id })
        .then(function(list) {
            return callback(null, list);
        })
        .catch(function(err) {
            if (err.name === "SequelizeForeignKeyConstraintError" && err.index === "grand_army_list_fk") {
                var error = new Error(errors.referenceNotFound);
                error.parameterName = 'gal_id';
                return callback(error);
            }
            else {
                return callback(err);
            }
        });
};

exports.update = function(listId, listData, callback) {
    if (!listId) {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }

    async.waterfall([
            function(cb) {
                updateArmyListTable(listId, listData, cb);
            },
            function(list, cb) {
                updateArmyDateRangeTable(list, listData, cb);
            }
        ],
        function(err, list) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, list);
            }
        }
    );
};

exports.deleteById = function(listId, callback) {
    if (!listId) {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }

    armyListModel.findById(listId)
        .then(function(list) {
            if (list) {
                list.destroy()
                    .then(function () {
                        return callback(null, list);
                    });
            }
            else {
                var error = new Error(errors.notFound);
                return callback(error);
            }
        });
};

function updateArmyListTable(listId, listData, callback) {
    armyListModel.findById(listId)
        .then(function(list) {
            var filteredData = _.pick(listData, ['name', 'gal_id']);
            _.assign(list, filteredData);
            list.save()
                .then(function (err) {
                    return callback(null, list.toJSON());
                })
                .catch(function (err) {
                    if (err.name === "SequelizeForeignKeyConstraintError" && err.index === "grand_army_list_fk") {
                        var error = new Error(errors.referenceNotFound);
                        error.parameterName = 'gal_id';
                        return callback(error);
                    }
                    else {
                        return callback(err);
                    }
                });
        });
}

function updateArmyDateRangeTable(list, listData, callback) {
    list.date_ranges = [];

    if (listData.date_ranges && listData.date_ranges.length > 0) {
        armyDateRangeModel.findAll()
            .then(function(existingDateRanges) {
                var rowsToDelete = [];
                var rowsToUpdate = [];
                var rowsToInsert = [];

                // Start by assuming that all rows need to be deleted
                for (var i = 0; i < existingDateRanges.length; ++i) {
                    rowsToDelete.push(existingDateRanges.id);
                }

                for (i = 0; i < listData.date_ranges.length; ++i) {
                    var dateRangeId = listData.date_ranges[i].id;
                    if (dateRangeId) {
                        var index = rowsToDelete.indexOf(dateRangeId);
                        if (index !== -1) {
                            rowsToDelete.splice(index, 1);
                            rowsToUpdate.push(listData.date_ranges[i]);
                        }
                    }
                    else {
                        rowsToInsert.push(listData.date_ranges[i])
                    }
                }

                async.series([
                        function(cb) {
                            // Insert new rows
                            aarmyDateRangeModel.bulkCreate()
                                .then(function() {
                                    cb(null);
                                })
                                .catch(function(err) {
                                    cb(err);
                                });
                        },
                        function(cb) {
                            // Update existing rows
                        },
                        function(cb) {
                            // Delete rows omitted from listData

                        }
                    ],
                    function(err, results) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            return callback(null, list);
                        }
                    });
            })
            .catch(function(err) {
                return callback(err);
            });
    }
    else {
        // listData doesn't have any date ranges, so
        // delete all rows corresponding to this army list
        armyDateRangeModel.destroy({ where: { army_id: list.id }})
            .then(function(rowCount) {
                return callback(null, list);
            })
            .catch(function(err) {
                return callback(err);
            });
    }
}