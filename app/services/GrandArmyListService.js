'use strict';

var models = require('../models');
var tokenAuthz = require('../lib/tokenAuthz');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateName: 'Duplicate name',
    notFound: 'Not found'
};
exports.errors = errors;

var grandArmyListModel = models.grandArmyListModel;

exports.retrieveByQuery = function(query, callback) {
    grandArmyListModel.findAll({ }).then(function(lists) {
        return callback(null, lists);
    });
};

exports.retrieveById = function(listId, callback) {
    if (listId) {
        grandArmyListModel.findById(listId).then(function(list) {
            return callback(null, list);
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }
};

exports.create = function(listData, callback) {
    // Insert the row
    grandArmyListModel.create({ name: listData.name })
        .then(function(savedList) {
            return callback(null, savedList);
        })
        .catch(function(err) {
            return callback(err);
        });
};

exports.update = function(listId, listData, callback) {
    if (listId) {
        grandArmyListModel.findById(listId)
            .then(function(list) {
                _.assign(list, listData);
                list.save()
                    .then(function(err) {
                        return callback(null, list);
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
        grandArmyListModel.findById(listId)
            .then(function(list) {
                list.destroy().then(function() {
                    return callback(null, list);
                });
            });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'listId';
        return callback(error);
    }
};