'use strict';

var dateRangesSubschema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            start_date: { type: 'number', required: true },
            end_date: { type: 'number', required: true }
        },
        additionalProperties: false
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
            gal_id: { type: ['number', 'null'] },
            date_ranges: dateRangesSubschema
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
            name: { type: 'string' },
            gal_id: { type: ['number', 'null'] },
            date_ranges: dateRangesSubschema
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};