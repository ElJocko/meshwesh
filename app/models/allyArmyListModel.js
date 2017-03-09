'use strict';

const mongoose = require('mongoose');
const DateRange = require('./subschemas/dateRangeSchema');
const TroopOption = require('./subschemas/troopOptionSchema');
const transform = require('./lib/transform');

// Create the schema
const AllyArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listId: { type: Number },
    sublistId: { type: String },
    dateRange: { type: DateRange },
    troopOptions: [ TroopOption ],
    internalContingent: { type: Boolean },
});

AllyArmyListSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
const AllyArmyListModel = mongoose.model('AllyArmyList', AllyArmyListSchema);

module.exports = AllyArmyListModel;
