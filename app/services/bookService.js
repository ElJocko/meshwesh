'use strict';

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
    // Pretend to get a count of each document
    var books = [];
    var triumphBook = {
        name: 'Triumph!',
        thematicCategoryCount: 23,
        grandArmyListCount: 202,
        armyListCount: 988
    };
    books.push(triumphBook);

    return callback(null, books);
};

