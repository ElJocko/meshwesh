'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var ThematicCategoryToArmyListXrefSchema = new mongoose.Schema({
    thematicCategory: { type: mongoose.Schema.Types.ObjectId, required: true },
    armyList: { type: mongoose.Schema.Types.ObjectId, required: true }
});

ThematicCategoryToArmyListXrefSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var ThematicCategoryToArmyListXrefModel = mongoose.model('ThematicCategoryToArmyListXref', ThematicCategoryToArmyListXrefSchema);

module.exports = ThematicCategoryToArmyListXrefModel;
