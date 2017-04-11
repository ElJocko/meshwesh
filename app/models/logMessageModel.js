'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var LogMessageSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    timestamp: { type: Date, required: true },
    message: { type: String, required: true }
});

LogMessageSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

// Create the model
var LogMessageModel = mongoose.model('LogMessage', LogMessageSchema);

module.exports = LogMessageModel;
