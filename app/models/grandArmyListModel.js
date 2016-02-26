'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var GrandArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

GrandArmyListSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var GrandArmyListModel = mongoose.model('GrandArmyList', GrandArmyListSchema);

module.exports = GrandArmyListModel;
