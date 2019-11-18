'use strict';

var mongoose = require('mongoose');

// Create the schema
var ArmyBattleCardEntrySchema = new mongoose.Schema({
    battleCardCode: { type: String, required: true },
    note: { type: String }
});

ArmyBattleCardEntrySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = ArmyBattleCardEntrySchema;