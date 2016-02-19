'use strict';

var dateRangesSubschema = {
    type: ['array', 'null'],
    items: {
        type: 'object',
        properties: {
            startDate: { type: 'number', requred: true },
            endDate: { type: 'number', requred: true }
        }
    }
};

// Schemas for validating requests
exports.retrieveArmyListsByQuery = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

exports.createArmyList = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true },
            grandArmyList: { type: ['string', 'null'] },
            dateRanges: dateRangesSubschema
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.retrieveArmyListById = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

exports.updateArmyList = {
    body: {
        type: 'object',
        properties: {
            id: { type: ['string', 'null'] },
            name: { type: 'string' },
            grandArmyList: { type: ['string', 'null'] },
            dateRanges: dateRangesSubschema
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};