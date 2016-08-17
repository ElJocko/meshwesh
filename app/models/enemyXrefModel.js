'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var EnemyXrefSchema = new mongoose.Schema({
    armyList1: { type: mongoose.Schema.Types.ObjectId, required: true },
    armyList2: { type: mongoose.Schema.Types.ObjectId, required: true }
});

EnemyXrefSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var EnemyXrefModel = mongoose.model('EnemyXref', EnemyXrefSchema);

module.exports = EnemyXrefModel;
