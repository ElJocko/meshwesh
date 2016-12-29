'use strict';

var mongoose = require('mongoose');
var TroopOption = require('./subschemas/allyTroopOptionSchema');
var transform = require('./lib/transform');

// Create the schema
var AllyArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listId: { type: Number },
    sublistId: { type: String },
    troopOptions: [ TroopOption ]
});

AllyArmyListSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var AllyArmyListModel = mongoose.model('AllyArmyList', AllyArmyListSchema);

module.exports = AllyArmyListModel;