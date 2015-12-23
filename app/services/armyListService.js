'use strict';

var models = require('../models');
var tokenAuthz = require('../lib/tokenAuthz');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Not found',
    referenceNotFound: 'Reference not found'
};
exports.errors = errors;

var armyListModel = models.armyListModel;
var dateRangeModel = models.armyDateRangeModel;

exports.retrieveByQuery = function(query, callback) {
    armyListModel.findAll(query).then(function(lists) {
        return callback(null, lists);
    });
};

exports.retrieveById = function(listId, callback) {
    if (listId) {
        armyListModel.findById(listId).then(function(armyList) {
            armyList = armyList.get({ plain: true });
            addDateRanges(armyList, function(newArmyList) {
                return callback(null, newArmyList);
            });
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }
};

exports.create = function(listData, callback) {
    // Insert a row in the army_list table
    armyListModel.create({ name: listData.name, gal_id: listData.gal_id })
        .then(function(savedList) {
            // Add the army id to the date range objects
            if (listData.date_ranges) {
                saveDateRanges(listData.date_ranges, savedList.id, function(err) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        // And add the date ranges to the army list object
                        savedList = savedList.get({ plain: true });
                        addDateRanges(savedList, function(newArmyList) {
                            return callback(null, newArmyList);
                        });
                    }
                });
            }
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
    if (listId) {
        armyListModel.findById(listId)
            .then(function(list) {
                _.assign(list, listData);
                list.save()
                    .then(function(err) {
                        if (listData.date_ranges) {
                            saveDateRanges(listData.date_ranges, list.id, function(err) {
                                if (err) {
                                    callback(err);
                                }
                                else {
                                    // And add the date ranges to the army list object
                                    var plainList = list.get({ plain: true });
                                    addDateRanges(plainList, function(newArmyList) {
                                        return callback(null, newArmyList);
                                    });
                                }
                            });
                        }
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
            });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }
};

exports.deleteById = function(listId, callback) {
    if (listId) {
        armyListModel.findById(listId)
            .then(function(list) {
                if (list) {
                    list.destroy().then(function () {
                        return callback(null, list);
                    });
                }
                else {
                    var error = new Error(errors.notFound);
                    return callback(error);
                }
            });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }
};

function saveDateRanges(dateRanges, armyListId, cb) {
    // Delete the existing rows for this army list
    dateRangeModel.destroy({ where: { army_list_id: armyListId }})
        .then(function(affectedRows) {
            // Add the army id to the date range objects
            _.forEach(dateRanges, function(item) {
                item.army_list_id = armyListId;
            });

            // Insert rows in the army_date_range table
            dateRangeModel.bulkCreate(dateRanges)
                .then(function() {
                    return cb();
                })
                .catch(function(err) {
                    // TBD: Rollback army_list entry???
                    return cb(err);
                });
        })
        .catch(function(err) {
            // TBD: Rollback army_list entry???
            cb(err);
        });
}

function addDateRanges(armyList, cb) {
    var query = { where: { army_list_id: armyList.id }};
    dateRangeModel.findAll(query).then(function(dateRanges) {
        armyList.date_ranges = [];
        _.forEach(dateRanges, function(item) {
            armyList.date_ranges.push(_.pick(item, ['start_date', 'end_date']));
        });
        cb(armyList);
    });
}