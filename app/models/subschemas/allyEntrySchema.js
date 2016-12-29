'use strict';

var mongoose = require('mongoose');

// Create the schema
var AllyEntrySchema = new mongoose.Schema({
    name: { type: String },
    allyArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'AllyArmyList' }
});

AllyEntrySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AllyEntrySchema;
