'use strict';

var dateRangeSubschema = {
    type: 'object',
    properties: {
        startDate: { type: 'number', requred: true },
        endDate: { type: 'number', requred: true }
    }
};

var troopOptionSubschema = {
    type: ['array', 'null'],
    items: {
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
            userCode: { type: 'string' },
            grandArmyList: { type: ['string', 'null'] },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: troopOptionSubschema
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
            userCode: { type: 'string' },
            grandArmyList: { type: ['string', 'null'] },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: troopOptionSubschema
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};