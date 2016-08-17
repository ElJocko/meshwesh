'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var ThematicCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

ThematicCategorySchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var ThematicCategoryModel = mongoose.model('ThematicCategory', ThematicCategorySchema);

module.exports = ThematicCategoryModel;
