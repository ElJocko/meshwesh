'use strict';

var mongoose = require('mongoose');

// Create the schema
var BattleCardEntrySchema = new mongoose.Schema({
    min: { type: Number },
    max: { type: Number },
    battleCardCode: { type: String, required: true },
    note: { type: String }
});

BattleCardEntrySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = BattleCardEntrySchema;
