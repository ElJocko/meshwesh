'use strict';

var ThematicCategory = require('../models/thematicCategoryModel');
var GrandArmyList = require('../models/grandArmyListModel');
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
        GrandArmyList.count({ }, function(err, count) {
            book.grandArmyListCount = count;
            ArmyList.count({ }, function(err, count) {
                book.armyListCount = count;
                books.push(book);

                return callback(null, books);
            });
        });
    });
};

