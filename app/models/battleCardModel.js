'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var BattleCardSchema = new mongoose.Schema({
    permanentCode: { type: String, required: true, unique: true },
    displayName: { type: String },
    importName: { type: String },
    category: { type: String }  // army or troop
});

BattleCardSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var BattleCardModel = mongoose.model('BattleCard', BattleCardSchema);

module.exports = BattleCardModel;
