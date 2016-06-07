'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var EnemyXrefSchema = new mongoose.Schema({
    armyList1: { type: mongoose.Schema.Types.ObjectId, required: true },
    armyList2: { type: mongoose.Schema.Types.ObjectId, required: true }
});

EnemyXrefSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var EnemyXrefModel = mongoose.model('EnemyXref', EnemyXrefSchema);

module.exports = EnemyXrefModel;
