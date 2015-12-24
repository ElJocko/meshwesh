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

exports.retrieveByQuery = function(query, callback) {
    armyListModel.findAll(query).then(function(lists) {
        return callback(null, lists);
    });
};

exports.retrieveById = function(listId, callback) {
    if (!listId) {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }

    armyListModel.findById(listId).then(function(armyList) {
        return callback(null, armyList);
    });
};

exports.create = function(listData, callback) {
    // Insert a row in the army_list table
    armyListModel.create({ name: listData.name, gal_id: listData.gal_id, date_ranges: listData.date_ranges })
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

    armyListModel.findById(listId)
        .then(function(list) {
            _.assign(list, listData);
            list.save()
                .then(function (err) {
                    return callback(null, list);
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
                list.destroy().then(function () {
                    return callback(null, list);
                });
            }
            else {
                var error = new Error(errors.notFound);
                return callback(error);
            }
        });
};