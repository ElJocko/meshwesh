'use strict';

var mongoose = require('mongoose');

// Create the schema
var GrandArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

GrandArmyListSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    }
});
// Create the model
var GrandArmyListModel = mongoose.model('GrandArmyList', GrandArmyListSchema);

module.exports = GrandArmyListModel;
