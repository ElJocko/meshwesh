'use strict';

var mongoose = require('mongoose');
var DateRange = require('./subschemas/dateRangeSchema');
var TroopOption = require('./subschemas/troopOptionSchema');
var AnnotatedRating = require('./subschemas/annotatedRatingSchema');
var transform = require('./transform');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listId: { type: Number },
    sublistId: { type: String },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    invasionRatings: [ AnnotatedRating ],
    maneuverRatings: [ AnnotatedRating ],
    dateRanges: [ DateRange ],
    description: { type : String },
    troopOptions: [ TroopOption ]
});

ArmyListSchema.set('toJSON', {
    transform: transform.toJSON
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;
