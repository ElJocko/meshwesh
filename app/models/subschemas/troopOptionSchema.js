'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');
var TroopEntry = require('./troopEntrySchema');
var BattleCardEntry = require('./battleCardEntrySchema');

// Create the schema
var TroopOptionSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    dateRanges: [ DateRange ],
    troopEntries: [ TroopEntry ],
    description: { type: String },
    note: { type: String },
    core: { type: String },
    battleCardEntries: [ BattleCardEntry ],
});

TroopOptionSchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = TroopOptionSchema;
