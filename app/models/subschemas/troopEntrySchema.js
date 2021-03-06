'use strict';

var mongoose = require('mongoose');

// Create the schema
var TroopEntrySchema = new mongoose.Schema({
    troopTypeCode: { type: String, required: true },
    dismountTypeCode: { type: String },
    note: { type: String }
});

TroopEntrySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = TroopEntrySchema;
