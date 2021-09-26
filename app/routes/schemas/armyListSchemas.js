'use strict';

const dateRangeSubschema = {
    type: 'object',
    properties: {
        startDate: { type: 'number', requred: true },
        endDate: { type: 'number', requred: true }
    }
};

const troopEntrySubschema = {
    type: 'object',
    properties: {
        troopTypeCode: { type: 'string', requred: true },
        dismountTypeCode: { type: ['string', null] }
    }
};

const troopOptionSubschema = {
    type: 'object',
    properties: {
        min: { type: 'number', requred: true },
        max: { type: 'number', requred: true },
        dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
        troopEntries: { type: ['array', null], items: troopEntrySubschema },
        description: { type: 'string' },
        general: { type: 'boolean' },
        core: { type: 'string' }
    }
};

const annotatedRatingSchema = {
    type: 'object',
    properties: {
        value: { type: 'number', required: true },
        note: { type: ['string', null] }
    }
};

const annotatedTopographySchema = {
    type: 'object',
    properties: {
        value: { type: 'string', required: true },
        note: { type: ['string', null] }
    }
};

// Schemas for validating requests
exports.retrieveArmyListsByQuery = {
    body: { additionalProperties: false },
    query: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            summary: { type: 'string' }
        },
        additionalProperties: false }
};

exports.createArmyList = {
    body: {
        type:'object',
        properties: {
            name: { type: 'string', required: true },
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            sortId: { type: 'number' },
            invasionRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            maneuverRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            homeTopographies: { type: ['array', 'null'], items: annotatedTopographySchema },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: { type: ['array', 'null'], items: troopOptionSubschema },
            showTroopOptionDescriptions: { type: 'boolean' },
            derivedData: { type: 'object' }
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
            listId: { type: 'number' },
            sublistId: { type: 'string' },
            sortId: { type: 'number' },
            invasionRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            maneuverRatings: { type: ['array', 'null'], items: annotatedRatingSchema },
            homeTopographies: { type: ['array', 'null'], items: annotatedTopographySchema },
            dateRanges: { type: ['array', 'null'], items: dateRangeSubschema },
            description: { type: ['string', 'null'] },
            troopOptions: { type: ['array', 'null'], items: troopOptionSubschema },
            showTroopOptionDescriptions: { type: 'boolean' },
            derivedData: { }
        },
        additionalProperties: false
    },
    query: { additionalProperties: false }
};

exports.deleteArmyList = {
    body: { additionalProperties: false },
    query: { additionalProperties: false }
};
