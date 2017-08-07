'use strict';

// Schemas for validating requests
exports.signIn = {
    body: {
        type: 'object',
        properties: {
            emailAddress: { type: 'string', required: true },
            password: { type: 'string', required: true }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};