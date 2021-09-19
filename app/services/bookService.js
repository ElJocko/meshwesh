'use strict';

const ThematicCategory = require('../models/thematicCategoryModel');
const TroopType = require('../models/troopTypeModel');
const ArmyList = require('../models/armyListModel');
const BattleCard = require('../models/battleCardModel');

const errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateCode: 'Duplicate code',
    notFound: 'Document not found'
};
exports.errors = errors;

exports.retrieveByQuery = function(query, callback) {
    const books = [];

    const book = {
        name: 'Triumph!'
    };

    ThematicCategory.count({ }, (err, count) => {
        book.thematicCategoryCount = count;
        TroopType.count({ }, (err, count) => {
            book.troopTypeCount = count;
            ArmyList.count({ }, (err, count) => {
                book.armyListCount = count;
                BattleCard.count({ showInList: true }, (err, count) => {
                    book.battleCardCount = count;
                    books.push(book);

                    return callback(null, books);
                });
            });
        });
    });
};

