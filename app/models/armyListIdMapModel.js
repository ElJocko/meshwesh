'use strict';

const mongoose = require('mongoose');

// Create the schema
const ArmyListIdMapSchema = new mongoose.Schema({
  listId: { type: String, required: true },
  sublistId: { type: String, required: true },
  databaseId: { type: String, required: true }
});

// Create the model
const ArmyListIdMapModel = mongoose.model('ArmyListIdMap', ArmyListIdMapSchema);

module.exports = ArmyListIdMapModel;
