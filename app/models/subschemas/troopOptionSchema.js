'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');

// Create the schema
var TroopOptionSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    dateRange: { type: DateRange },
    troopTypes: [ String ],
    description: { type: String },
    general: { type: Boolean },
    core: { type: Boolean }
});

TroopOptionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = TroopOptionSchema;