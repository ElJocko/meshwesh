'use strict';

var dateRangeSubschema = {
    type: 'object',
    properties: {
        startDate: { type: 'number', requred: true },
        endDate: { type: 'number', requred: true }
    }
};

var troopEntrySubschema = {
    type: 'object',
    properties: {
        troopTypeCode: { type: 'string', requred: true },
        dismountTypeCode: { type: ['string', null] }
    }
};

var allyTroopOptionSubschema = {
    type: 'object',
    properties: {
        min: { type: 'number', requred: true },
        max: { type: 'number', requred: true },
        dateRange: dateRangeSubschema,
        troopEntries: { type: ['array', null], items: troopEntrySubschema },
        description: { type: 'string' }
    }
};

// Schemas for validating requests
exports.retrieveAllyArmyListsByQuery = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

exports.createAllyArmyList = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true },
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            troopOptions: { type: ['array', 'null'], items: allyTroopOptionSubschema },
            internalContingent: { type: 'boolean' }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.retrieveAllyArmyListById = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

exports.updateAllyArmyList = {
    body: {
        type: 'object',
        properties: {
            id: { type: ['string', 'null'] },
            name: { type: 'string' },
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            troopOptions: { type: ['array', 'null'], items: allyTroopOptionSubschema },
            internalContingent: { type: 'boolean' }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteAllyArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};