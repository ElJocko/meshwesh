'use strict';

var ThematicCategory = require('../models/thematicCategoryModel');
var TroopType = require('../models/troopTypeModel');
var ArmyList = require('../models/armyListModel');
var async = require('async');
var _ = require('lodash');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateCode: 'Duplicate code',
    notFound: 'Document not found'
};
exports.errors = errors;

exports.retrieveByQuery = function(query, callback) {
    var books = [];

    var book = {
        name: 'Triumph!'
    };

    ThematicCategory.count({ }, function(err, count) {
        book.thematicCategoryCount = count;
        TroopType.count({ }, function(err, count) {
            book.troopTypeCount = count;
            ArmyList.count({ }, function(err, count) {
                book.armyListCount = count;
                books.push(book);

                return callback(null, books);
            });
        });
    });
};

