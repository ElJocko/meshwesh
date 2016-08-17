'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var TroopTypeSchema = new mongoose.Schema({
    permanentCode: { type: String, required: true, unique: true },
    displayCode: { type: String },
    displayName: { type: String },
    importName: { type: String },
    category: { type: String },
    cost: { type: Number },
    description: { type: String },
    order: { type: String }
});

TroopTypeSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var TroopTypeModel = mongoose.model('TroopType', TroopTypeSchema);

module.exports = TroopTypeModel;
