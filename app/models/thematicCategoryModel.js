'use strict';

var mongoose = require('mongoose');

// Create the schema
var ThematicCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

ThematicCategorySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    }
});

// Create the model
var ThematicCategoryModel = mongoose.model('ThematicCategory', ThematicCategorySchema);

module.exports = ThematicCategoryModel;
