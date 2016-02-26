'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    dateRanges: [ { startDate: Number, endDate: Number } ]
});

ArmyListSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;
