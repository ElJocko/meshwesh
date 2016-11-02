'use strict';

var mongoose = require('mongoose');
var DateRange = require('./subschemas/dateRangeSchema');
var TroopOption = require('./subschemas/troopOptionSchema');
var TroopEntry = require('./subschemas/troopEntrySchema');
var AnnotatedRating = require('./subschemas/annotatedRatingSchema');
var AnnotatedTopography = require('./subschemas/annotatedTopographySchema');
var AllyEntry = require('./subschemas/allyEntrySchema');
var transform = require('./lib/transform');

// Create the schema
var ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listId: { type: Number },
    sublistId: { type: String },
    sortId: { type: Number },
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    invasionRatings: [ AnnotatedRating ],
    maneuverRatings: [ AnnotatedRating ],
    homeTopographies: [ AnnotatedTopography ],
    dateRanges: [ DateRange ],
    description: { type: String },
    troopOptions: [ TroopOption ],
    showTroopOptionDescriptions: { type: Boolean },
    troopEntriesForGeneral: [ TroopEntry ],
    status: { type: String },
    allies: [ AllyEntry ],
    derivedData: {
        extendedName: { type: String },
        listStartDate: { type: Number },
        listEndDate: { type: Number }
    }
});

ArmyListSchema.set('toObject', {
    transform: transform.removeDatabaseArtifacts
});

ArmyListSchema.pre('save', function(next) {
    var self = this;
    addDateRangeInfo(self);

    next();
});

// Create the model
var ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;


/////

function addDateRangeInfo(armyList) {
    var dateRange = calculateArmyListDateRange(armyList);
    armyList.derivedData = {
        listStartDate: dateRange.startDate,
        listEndDate: dateRange.endDate
    };

    var dateRangeString = dateRangeAsString(dateRange);
    armyList.derivedData.extendedName = armyList.name + "  " + dateRangeString;
}

function dateRangeAsString(dateRange) {
    var dateRangeString = '';
    if (dateRange.startDate == null || dateRange.endDate == null) {
        //
    }
    else if (dateRange.startDate < 0 && dateRange.endDate < 0) {
        dateRangeString = Math.abs(dateRange.startDate) + " to " + Math.abs(dateRange.endDate) + " BC";
    }
    else if (dateRange.startDate >= 0 && dateRange.endDate >= 0) {
        dateRangeString = dateRange.startDate + " to " + dateRange.endDate + " AD";
    }
    else {
        dateRangeString = Math.abs(dateRange.startDate) + " BC to " + dateRange.endDate + " AD";
    }

    return dateRangeString;
}

function calculateArmyListDateRange(armyList) {
    // Find the earliest start and latest end dates
    var earliestStart = null;
    var latestEnd = null;

    armyList.dateRanges.map(function(dateRange) {
        if (earliestStart) {
            earliestStart = Math.min(earliestStart, dateRange.startDate);
        }
        else {
            earliestStart = dateRange.startDate;
        }

        if (latestEnd) {
            latestEnd = Math.max(latestEnd, dateRange.endDate);
        }
        else {
            latestEnd = dateRange.endDate;
        }
    });

    var armyListDateRange = {
        startDate: earliestStart,
        endDate: latestEnd
    };

    return armyListDateRange;
}
