'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var GrandArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    listId: { type: Number }
});

GrandArmyListSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var GrandArmyListModel = mongoose.model('GrandArmyList', GrandArmyListSchema);

module.exports = GrandArmyListModel;
