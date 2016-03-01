'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListSummaryController', ArmyListSummaryController);

ArmyListSummaryController.$inject = ['$location', 'ArmyListService'];

function ArmyListSummaryController($location, ArmyListService) {
    var vm = this;

    var armyListPromise = ArmyListService.list().$promise;
    vm.create = showCreateArmyList;
    vm.edit = showEditArmyList;

    armyListPromise.then(function(armyLists) {
        vm.lists = armyLists;
        vm.lists.map(function(list) {
            var dateRangeString = dateRangeAsString(list.dateRanges);
            list.nameWithDateRange = list.name + "  " + dateRangeString;
        });
    });

    function showCreateArmyList() {
        $location.path('/armyList/create');
    }

    function showEditArmyList(listId) {
        $location.path('/armyList/' + listId + '/edit');
    }
}

function dateRangeAsString(dateRanges) {
    // Find the earliest start and latest end dates
    var earliestStart = 9999;
    var latestEnd = -9999;

    dateRanges.map(function(dateRange) {
        earliestStart = Math.min(earliestStart, dateRange.startDate);
        latestEnd = Math.max(latestEnd, dateRange.endDate);
    });

    var dateRangeString = "";
    if (earliestStart === 9999 || latestEnd === -9999) {
        //
    }
    else if (earliestStart < 0 && latestEnd < 0) {
        dateRangeString = Math.abs(earliestStart) + " to " + Math.abs(latestEnd) + " BC";
    }
    else if (earliestStart >= 0 && latestEnd >= 0) {
        dateRangeString = earliestStart + " to " + latestEnd + " AD";
    }
    else {
        dateRangeString = Math.abs(earliestStart) + " BC to " + latestEnd + " AD";
    }

    return dateRangeString;
}