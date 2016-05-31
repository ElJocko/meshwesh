'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');
var TroopEntry = require('./troopEntrySchema');

// Create the schema
var TroopOptionSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    allyMin: { type: Number, required: true },
    allyMax: { type: Number, required: true },
    dateRange: { type: DateRange },
    troopEntries: [ TroopEntry ],
    description: { type: String },
    core: { type: Boolean }
});

TroopOptionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = TroopOptionSchema;
