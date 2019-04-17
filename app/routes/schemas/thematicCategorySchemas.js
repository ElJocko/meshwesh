'use strict';

const categoryIdSubschema = {
    type: 'string',
    format: 'alphanumeric',
    minLength: 24,
    maxLength: 24,
    required: true
};

// Schemas for validating requests
exports.retrieveByQuery = {
    params: { additionalProperties: false },
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' }
        },
        additionalProperties: false }
};

exports.create = {
    params: { additionalProperties: false },
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
    params: {
        type: 'object',
        properties: {
            categoryId: categoryIdSubschema
        },
        additionalProperties: false
    },
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};

exports.update = {
    params: {
        type: 'object',
        properties: {
            categoryId: categoryIdSubschema
        },
        additionalProperties: false
    },
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
    params: {
        type: 'object',
        properties: {
            categoryId: categoryIdSubschema
        },
        additionalProperties: false
    },
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};
