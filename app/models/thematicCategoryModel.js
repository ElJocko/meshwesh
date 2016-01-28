'use strict';

var mongoose = require('mongoose');

// Create the schema
var ThematicCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

// Create the model
var ThematicCategoryModel = mongoose.model('ThematicCategory', ThematicCategorySchema);

module.exports = ThematicCategoryModel;
