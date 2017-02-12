'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListExploreController', ArmyListExploreController);

ArmyListExploreController.$inject = ['$routeParams', '$location', '$q', '$uibModal', 'uiGridConstants', 'ArmyListService', 'GrandArmyListService', 'TroopOptionsAnalysisService'];

function ArmyListExploreController($routeParams, $location, $q, $uibModal, uiGridConstants, ArmyListService, GrandArmyListService, TroopOptionsAnalysisService) {
    var vm = this;

    vm.totalMinMax = {
        minPoints: null,
        maxPoints: null
    };

    initializeDateRangeGrid();
    initializeInvasionRatingGrid();
    initializeManeuverRatingGrid();
    initializeTroopOptionsGrid();

    var listId = $routeParams.listId;
    initializeData();

    vm.onClickArmyList = onClickArmyList;
    function onClickArmyList(id) {
        $location.path('/armyList/' + id + '/explore');
    }

    vm.onClickThematicCategory = onClickThematicCategory;
    function onClickThematicCategory(id) {
        $location.path('/thematicCategory/' + id + '/explore');
    }

    function initializeDateRangeGrid() {
        vm.dateRangeGridOptions = {
            columnDefs: [
                { field: 'startDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC, priority: 0 }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'endDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false }
            ],
            rowHeight: 35,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.dateRangeGridApi = gridApi;
            }
        };
    }

    function initializeInvasionRatingGrid() {
        vm.invasionRatingGridOptions = {
            columnDefs: [
                { field: 'value', displayName: 'Value', type: 'number', sort: { direction: uiGridConstants.ASC, priority: 0 }, enableSorting: false, width: 90, enableColumnMenu: false },
                { field: 'note', displayName: 'Note', type: 'string', enableSorting: false, width: 160, enableColumnMenu: false }
            ],
            rowHeight: 35,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.invationRatingGridApi = gridApi;
            }
        };
    }

    function initializeManeuverRatingGrid() {
        vm.maneuverRatingGridOptions = {
            columnDefs: [
                { field: 'value', displayName: 'Value', type: 'number', sort: { direction: uiGridConstants.ASC, priority: 0 }, enableSorting: false, width: 90, enableColumnMenu: false },
                { field: 'note', displayName: 'Note', type: 'string', enableSorting: false, width: 160, enableColumnMenu: false }
            ],
            rowHeight: 35,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.maneuverRatingGridApi = gridApi;
            }
        };
    }

    function initializeTroopOptionsGrid() {
        vm.troopOptionGridOptions = {
            columnDefs: [
                { field: 'general', displayName: 'General?', type: 'boolean', cellClass: 'td-boolean-check', cellFilter: 'mwDisplayBooleanCheck', width: 80, enableColumnMenu: false },
                { field: 'core', displayName: 'Battle Line?', type: 'boolean', cellClass: 'td-boolean-check', cellFilter: 'mwDisplayBooleanCheck', width: 80, enableColumnMenu: false },
                { field: 'min', displayName: 'Min', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'max', displayName: 'Max', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'troopEntries', displayName: 'Troop Entries', type: 'string', cellFilter: 'mwDisplayTroopTypeEntriesList', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 330, enableColumnMenu: false },
                { field: 'description', displayName: 'Description', type: 'string', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 200, enableColumnMenu: false },
                { field: 'startDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'endDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false }
            ],
            rowHeight: 35,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.troopOptionsGridApi = gridApi;
            }
        };
    }

    function resetGridHeight(gridClass, data) {
        // TBD: Grid only shows rows for initial height (in .css). Set to 2000px as workaround. Need to
        // find a way to tell the grid that it has a new size.
        var height = (data.length * 35) + 32;

        var gridElement = document.getElementById(gridClass);
        if (gridElement) {
            angular.element(gridElement).css('height', height + 'px');
        }

        // TBD: This seems fragile
        var gridViewport = document.getElementsByClassName('ui-grid-viewport');
        if (gridViewport) {
            for (var index = 0; index < gridViewport.length; ++index) {
                var viewport = gridViewport[index];
                var parentClass = viewport.parentNode.parentNode.parentNode.classList[0];
                if (parentClass === gridClass) {
                    angular.element(viewport).css('height', height + 'px');
                }
            }
        }
    }

    function initializeData() {
        // Get the army list if it exists
        var armyListPromise = null;
        var associatedArmyListsPromise = null;
        var enemyArmyListsPromise = null;
        var thematicCategoriesPromise = null;
        var allyOptionsPromise = null;
        if (listId) {
            armyListPromise = ArmyListService.get({ id: listId }).$promise;
            associatedArmyListsPromise = ArmyListService.associatedArmyLists.list({ id: listId }).$promise;
            enemyArmyListsPromise = ArmyListService.enemyArmyLists.list({ id: listId }).$promise;
            thematicCategoriesPromise = ArmyListService.thematicCategories.list({ id: listId }).$promise;
            allyOptionsPromise = ArmyListService.allyOptions.list({ id: listId }).$promise;
        }

        // Get the grand army lists
        var grandArmyListsPromise = GrandArmyListService.list().$promise;

        // Handle the response after the services complete
        var servicePromises = {
            armyList: armyListPromise,
            associatedArmyLists: associatedArmyListsPromise,
            enemyArmyLists: enemyArmyListsPromise,
            thematicCategories: thematicCategoriesPromise,
            grandArmyLists: grandArmyListsPromise,
            allyOptions: allyOptionsPromise
        };

        $q
            .all(servicePromises)
            .then(handleResponse);
    }

    function handleResponse(results) {
        // Default to no grand army list selected
        vm.galSelected = null;

        // We should always get an array of grand army lists
        vm.grandArmyLists = results.grandArmyLists;

        // Handle new or existing army list
        if (listId) {
            // Existing army list
            vm.armyList = results.armyList;

            // Add in the default status
            if (!vm.armyList.status) {
                vm.armyList.statusDisplayText = 'Status: Unknown';
                vm.armyList.statusType = 'status-warning';
            }
            else if (vm.armyList.status.toUpperCase() === 'DRAFT') {
                vm.armyList.statusDisplayText = 'Status: Rough Draft';
                vm.armyList.statusDisplaySubtext = '';
                vm.armyList.statusType = 'status-warning';
            }
            else if (vm.armyList.status.toUpperCase() === 'REVISED') {
                vm.armyList.statusDisplayText = 'Status: Ready';
                vm.armyList.statusDisplaySubtext = '(Final Review Pending)';
                vm.armyList.statusType = 'status-warning';
            }
            else if (vm.armyList.status.toUpperCase() === 'READY') {
                vm.armyList.statusDisplayText = 'Status: Ready';
                vm.armyList.statusDisplaySubtext = '';
                vm.armyList.statusType = 'status-ready';
            }
            else if (vm.armyList.status.toUpperCase() === 'FINAL') {
                vm.armyList.statusDisplayText = 'Status: Final';
                vm.armyList.statusDisplaySubtext = '';
                vm.armyList.statusType = 'status-ready';
            }
            else {
                vm.armyList.statusDisplayText = 'Status: Unknown';
                vm.armyList.statusDisplaySubtext = '';
                vm.armyList.statusType = 'status-warning';
            }

            vm.allyOptions = results.allyOptions;
            vm.allyOptions.forEach(function(option, index) {
                limitAllyOptionDateRange(option, vm.armyList.dateRanges[0], option.allyEntries);

                // Create the name for the ally option
                option.name = '';
                option.allyEntries.forEach(function(entry, index) {
                    entry.name = entry.name.toTitleCase();
                    // Add the entry name to the option name
                    if (index === 0) {
                        option.name = option.name + ' ' + entry.name;
                    }
                    else {
                        option.name = option.name + ' and ' + entry.name;
                    }

                    // Filter date ranges for the troop options vs the parent army list
                    entry.allyArmyList.troopOptions.forEach(function(troopOption) {
                        limitTroopOptionDateRange(troopOption, vm.armyList.dateRanges[0], option.dateRange);
                    });
                });
                option.name = option.name.toTitleCase();
            });

            vm.associatedArmyLists = results.associatedArmyLists;
//            console.log(vm.associatedArmyLists);

            vm.enemyArmyLists = results.enemyArmyLists;
//            console.log(vm.enemyArmyLists);

            vm.thematicCategories = results.thematicCategories;
//            console.log(vm.thematicCategories);

            // Find the grand army list that the army list belongs to
            if (vm.armyList.grandArmyList) {
                var galIndex = _.findIndex(vm.grandArmyLists, function (element) {
                    return (element.id === vm.armyList.grandArmyList);
                });

                if (galIndex !== -1) {
                    vm.galSelected = vm.grandArmyLists[galIndex];
                }
            }
        }
        else {
            // New army list
            vm.armyList = {
                name: "",
                grandArmyList: null,
                dateRanges: [],
                invasionRating: [],
                maneuverRating: []
            };
        }

        vm.dateRangeGridOptions.data = vm.armyList.dateRanges;
        vm.invasionRatingGridOptions.data = vm.armyList.invasionRatings;
        vm.maneuverRatingGridOptions.data = vm.armyList.maneuverRatings;
        vm.troopOptionGridOptions.data = vm.armyList.troopOptions;

        resetGridHeight('date-range-grid', vm.armyList.dateRanges);
        resetGridHeight('invasion-rating-grid', vm.armyList.invasionRatings);
        resetGridHeight('maneuver-rating-grid', vm.armyList.maneuverRatings);
        resetGridHeight('troop-option-grid', vm.armyList.troopOptions);

        performAnalysis();
    }

    function performAnalysis() {
        vm.totalMinMax = TroopOptionsAnalysisService.calculateTotalMinMaxPoints(vm.armyList.troopOptions);
    }

    // DateRange
    //   null: no date range limit
    //   invalid = true: invalid date range
    //   otherwise, startDate to endDate, inclusive

    function overlappingDateRange(dateRange1, dateRange2) {
        // Handle if either date range is null
        if (!dateRange1) {
            return dateRange2;
        }
        else if (!dateRange2) {
            return dateRange1;
        }

        // If either date range is invalid, the result is invalid
        if (dateRange1.invalid || dateRange2.invalid) {
            return { invalid: true };
        }

        const start = Math.max(dateRange1.startDate, dateRange2.startDate);
        const end = Math.min(dateRange1.endDate, dateRange2.endDate);

        if (start > end) {
            // No overlap. Date range is not valid.
            return { invalid: true };
        }
        else {
            // The date range to the overlapping parts of the ranges.
            return {
                startDate: start,
                endDate: end
            };
        }
    }

    function limitTroopOptionDateRange(troopOption, armyListDateRange, allyOptionDateRange) {
        if (!troopOption.dateRange) {
            // Troop option doesn't have a specific date range
            return;
        }

        let overlap = overlappingDateRange(troopOption.dateRange, armyListDateRange);
        overlap = overlappingDateRange(overlap, allyOptionDateRange);

        if (!overlap.invalid) {
            if (allyOptionDateRange && overlap.startDate === allyOptionDateRange.startDate && overlap.endDate === allyOptionDateRange.endDate) {
                // Overlap is identical to ally option date range. No specific date range required.
                overlap = null;
            }
            else if (overlap.startDate === armyListDateRange.startDate && overlap.endDate === armyListDateRange.endDate) {
                // No ally option date range and overlap is identical to army list date range. No specific date range required.
                overlap = null;
            }
        }

        troopOption.dateRange = overlap;
    }

    function limitAllyOptionDateRange(allyOption, armyListDateRange, allyEntries) {
        let overlap = overlappingDateRange(allyOption.dateRange, armyListDateRange);
        allyEntries.forEach(function(entry) {
            overlap = overlappingDateRange(overlap, entry.allyArmyList.dateRange);
        });

        if (!overlap.invalid && overlap.startDate === armyListDateRange.startDate && overlap.endDate === armyListDateRange.endDate) {
            // overlap is identical to the army list date range. No specific date range required.
            overlap = null;
        }

        allyOption.dateRange = overlap;
    }
}
