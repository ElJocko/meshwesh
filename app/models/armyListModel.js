'use strict';

var mongoose = require('mongoose');
//var GrandArmyList = require('./grandArmyList');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    dateRanges: [ { startDate: Number, endDate: Number } ]
});

ArmyListSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    }
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;
