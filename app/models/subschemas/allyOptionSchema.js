'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');
var AllyEntry = require('./allyEntrySchema');

// Create the schema
var AllyOptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateRange: { type: DateRange },
    note: { type: String },
    allyEntries: [ AllyEntry ]
});

AllyOptionSchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AllyOptionSchema;
