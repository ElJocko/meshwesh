'use strict';

var mongoose = require('mongoose');
var DateRange = require('./dateRangeSchema');

// Create the schema
var AllyEntrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateRange: { type: DateRange },
    allyArmyList: { type: mongoose.Schema.Types.ObjectId, required: true }
});

AllyEntrySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AllyEntrySchema;
