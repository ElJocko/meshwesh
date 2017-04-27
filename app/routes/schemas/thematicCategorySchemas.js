'use strict';

// Schemas for validating requests
exports.retrieveByQuery = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

exports.create = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.retrieveById = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

exports.update = {
    body: {
        type: 'object',
        properties: {
            id: { type: ['string', 'null'] },
            name: { type: 'string' }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.delete = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};
