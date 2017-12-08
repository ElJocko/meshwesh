'use strict';

const mongoose = require('mongoose');
const DateRange = require('./subschemas/dateRangeSchema');
const TroopOption = require('./subschemas/troopOptionSchema');
const TroopEntryGroup = require('./subschemas/troopEntryGroupSchema');
const AnnotatedRating = require('./subschemas/annotatedRatingSchema');
const AnnotatedTopography = require('./subschemas/annotatedTopographySchema');
const AllyOption = require('./subschemas/allyOptionSchema');
const transform = require('./lib/transform');

// Create the schema
const ArmyListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    listId: { type: Number },
    sublistId: { type: String },
    sortId: { type: Number },
    keywords: [ String ],
    grandArmyList: { type: mongoose.Schema.Types.ObjectId, ref: 'GrandArmyList' },
    invasionRatings: [ AnnotatedRating ],
    maneuverRatings: [ AnnotatedRating ],
    homeTopographies: [ AnnotatedTopography ],
    dateRanges: [ DateRange ],
    description: { type: String },
    troopOptions: [ TroopOption ],
    showTroopOptionDescriptions: { type: Boolean },
    troopEntriesForGeneral: [ TroopEntryGroup ],
    status: { type: String },
    allyOptions: [ AllyOption ],
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
    const self = this;
    addDateRangeInfo(self);

    next();
});

// Create the model
const ArmyListModel = mongoose.model('ArmyList', ArmyListSchema);

module.exports = ArmyListModel;


/////

function addDateRangeInfo(armyList) {
    const dateRange = calculateArmyListDateRange(armyList);
    armyList.derivedData = {
        listStartDate: dateRange.startDate,
        listEndDate: dateRange.endDate
    };

    const dateRangeString = dateRangeAsString(dateRange);
    armyList.derivedData.extendedName = armyList.name + "  " + dateRangeString;
}

function dateRangeAsString(dateRange) {
    let dateRangeString = '';
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
    let earliestStart = null;
    let latestEnd = null;

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

    const armyListDateRange = {
        startDate: earliestStart,
        endDate: latestEnd
    };

    return armyListDateRange;
}
