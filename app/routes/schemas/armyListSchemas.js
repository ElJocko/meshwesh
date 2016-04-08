'use strict';

var dateRangeSubschema = {
    type: 'object',
    properties: {
        startDate: { type: 'number', requred: true },
        endDate: { type: 'number', requred: true }
    }
};

var troopOptionSubschema = {
    type: 'object',
    properties: {
        min: { type: 'number', requred: true },
        max: { type: 'number', requred: true },
        dateRange: dateRangeSubschema,
        troopTypes: { type: ['array', null], items: { type: 'string' } },
        description: { type: 'string' },
        general: { type: 'boolean' },
        core: { type: 'boolean' }
    }
};

var annotatedRatingSchema = {
    type: 'object',
    properties: {
        value: { type: 'number', required: true },
        note: { type: ['string', null] }
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
            extendedName: { type: 'string' },
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            grandArmyList: { type: ['string', 'null'] },
            invasionRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            maneuverRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: { type: ['array', 'null'], items: troopOptionSubschema }
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
            extendedName: { type: 'string' },
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            grandArmyList: { type: ['string', 'null'] },
            invasionRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            maneuverRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: { type: ['array', 'null'], items: troopOptionSubschema }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};