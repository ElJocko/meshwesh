'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var ThematicCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

ThematicCategorySchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var ThematicCategoryModel = mongoose.model('ThematicCategory', ThematicCategorySchema);

module.exports = ThematicCategoryModel;
