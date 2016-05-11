'use strict';

var mongoose = require('mongoose');
var transform = require('./transform');

// Create the schema
var UserSchema = new mongoose.Schema({
    emailAddress: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true }
});

UserSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
