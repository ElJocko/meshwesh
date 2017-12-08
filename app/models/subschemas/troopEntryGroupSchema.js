'use strict';

var mongoose = require('mongoose');
const TroopEntry = require('./troopEntrySchema');

// Create the schema
var TroopEntryGroupSchema = new mongoose.Schema({
    troopEntries: [ TroopEntry ],
});

TroopEntryGroupSchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = TroopEntryGroupSchema;
