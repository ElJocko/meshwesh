'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');
var TroopEntry = require('./troopEntrySchema');

// Create the schema
var AllyTroopOptionSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    dateRange: { type: DateRange },
    troopEntries: [ TroopEntry ],
    description: { type: String },
    note: { type: String }
});

AllyTroopOptionSchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AllyTroopOptionSchema;
