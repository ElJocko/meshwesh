'use strict';

// Schemas for validating requests
exports.retrieveByQuerySchema = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

exports.createArmyListSchema = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true },
            gal_id: { type: ['number', 'null'] }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.retrieveByIdSchema = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

exports.updateArmyListSchema = {
    body: {
        type: 'object',
        properties: {
            id: { type: ['number', 'null'] },
            name: { type: 'string', required: true },
            gal_id: { type: ['number', 'null'] }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyListSchema = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};