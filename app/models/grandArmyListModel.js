'use strict';

var mongoose = require('mongoose');

// Create the schema
var GrandArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

// Create the model
var GrandArmyListModel = mongoose.model('GrandArmyList', GrandArmyListSchema);

module.exports = GrandArmyListModel;
