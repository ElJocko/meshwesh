'use strict';

var mongoose = require('mongoose');
//var GrandArmyList = require('./grandArmyList');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    dateRanges: [ { startDate: Number, endDate: Number } ]
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;
