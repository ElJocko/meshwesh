'use strict';

var mongoose = require('mongoose');
var DateRange = require('./subschemas/dateRangeSchema');
var TroopOption = require('./subschemas/troopOptionSchema');
var transform = require('./transform');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userCode: { type: String },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    dateRanges: [ DateRange ],
    description: { type : String },
    troopOptions: [ TroopOption ]
});

ArmyListSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;
