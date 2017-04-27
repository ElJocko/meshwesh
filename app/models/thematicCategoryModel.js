'use strict';

const mongoose = require('mongoose');
const transform = require('./lib/transform');

// Create the schema
const ThematicCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

ThematicCategorySchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
const ThematicCategoryModel = mongoose.model('ThematicCategory', ThematicCategorySchema);

module.exports = ThematicCategoryModel;
