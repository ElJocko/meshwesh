'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var TroopTypeSchema = new mongoose.Schema({
    permanentCode: { type: String, required: true, unique: true },
    displayCode: { type: String },
    displayName: { type: String },
    importName: { type: String },
    category: { type: String },
    cost: { type: Number },
    description: { type: String }
});

TroopTypeSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var TroopTypeModel = mongoose.model('TroopType', TroopTypeSchema);

module.exports = TroopTypeModel;
