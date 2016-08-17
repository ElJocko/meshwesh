'use strict';

var mongoose = require('mongoose');
var transform = require('./lib/transform');

// Create the schema
var UserSchema = new mongoose.Schema({
    emailAddress: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true }
});

UserSchema.set('toObject', {
    transform: transform.removeDatabaseArtifactsAndSanitizeUser
});

// Create the model
var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
