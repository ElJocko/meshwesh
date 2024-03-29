'use strict';

const titleCase = require('titlecase');

angular
    .module('meshweshControllers')
    .controller('ArmyListExploreController', ArmyListExploreController);

ArmyListExploreController.$inject = ['$route', '$location', '$q', '$uibModal', 'uiGridConstants', 'ArmyListService', 'TroopOptionsAnalysisService', 'BattleCardService'];

function ArmyListExploreController($route, $location, $q, $uibModal, uiGridConstants, ArmyListService, TroopOptionsAnalysisService, BattleCardService) {
    var vm = this;

    vm.loading = {
        armyList: true,
        enemyArmyLists: true,
        associatedArmyLists: true,
        thematicCategories: true
    };

    vm.loadFailed = {
        armyList: false,
        enemyArmyLists: false,
        associatedArmyLists: false,
        thematicCategories: false
    };

    vm.totalMinMax = {
        minPoints: null,
        maxPoints: null
    };

    onSelectArmySize('standard');

    initializeDateRangeGrid();
    initializeInvasionRatingGrid();
    initializeManeuverRatingGrid();
    initializeTroopOptionsGrid();

    var listId = $route.current.params.listId;
    initializeData();

    vm.onClickArmyList = onClickArmyList;
    function onClickArmyList(id) {
        $location.path('/armyList/' + id + '/explore');
    }

    vm.onClickThematicCategory = onClickThematicCategory;
    function onClickThematicCategory(id) {
        $location.path('/thematicCategory/' + id + '/explore');
    }

    vm.onSelectArmySize = onSelectArmySize;
    function onSelectArmySize(armySizeSelection) {
        vm.armySizeSelection = armySizeSelection;

        if (armySizeSelection === 'standard') {
            vm.armySizeSelectionText = 'Standard Triumph';
            vm.armySize = 'single';
        }
        else if (armySizeSelection === 'grand-three') {
            vm.armySizeSelectionText = 'Grand Triumph (3 Main Army Commands)';
            vm.armySize = 'triple';
        }
        else if (armySizeSelection === 'grand-two') {
            vm.armySizeSelectionText = 'Grand Triumph (2 Main Army Commands)';
            vm.armySize = 'double';
        }
        else if (armySizeSelection === 'grand-one') {
            vm.armySizeSelectionText = 'Grand Triumph (1 Main Army Command)';
            vm.armySize = 'single';
        }
        else if (armySizeSelection === 'grand-ally') {
            vm.armySizeSelectionText = 'Grand Triumph (Ally Army Command)';
            vm.armySize = 'single';
        }
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
            armyListPromise = ArmyListService.get({ id: listId });
            associatedArmyListsPromise = ArmyListService.associatedArmyLists.list({ id: listId });
            enemyArmyListsPromise = ArmyListService.enemyArmyLists.list({ id: listId });
            thematicCategoriesPromise = ArmyListService.thematicCategories.list({ id: listId });
            allyOptionsPromise = ArmyListService.allyOptions.list({ id: listId });
        }
        else {
            console.log('List Id not set');
        }

        // Handle the response after the services complete
        var servicePromises = {
            armyList: armyListPromise,
            allyOptions: allyOptionsPromise
        };

        $q
            .all(servicePromises)
            .then(handleSuccessResponse, handleErrorResponse);

        associatedArmyListsPromise.then(
            function(results) {
                vm.associatedArmyLists = results;
                vm.loading.associatedArmyLists = false;
            },
            function(reason) {
                console.log('Unable to load Associated Army Lists: ' + reason);
                vm.associatedArmyLists = null;
                vm.loading.associatedArmyLists = false;
                vm.loadFailed.associatedArmyLists = true;
            });

        enemyArmyListsPromise.then(
            function(results) {
                vm.enemyArmyLists = results;
                vm.loading.enemyArmyLists = false;
            },
            function(reason) {
                console.log('Unable to load Enemy Army Lists: ' + reason);
                vm.enemyArmyLists = null;
                vm.loading.enemyArmyLists = false;
                vm.loadFailed.enemyArmyLists = true;
            });

        thematicCategoriesPromise.then(
            function(results) {
                vm.thematicCategories = results;
                vm.loading.thematicCategories = false;
            },
            function(reason) {
                console.log('Unable to load Thematic Categories: ' + reason);
                vm.thematicCategories = null;
                vm.loading.thematicCategories = false;
                vm.loadFailed.thematicCategories = true;
            });
    }

    function handleSuccessResponse(results) {
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
                vm.armyList.statusDisplaySubtext = '';
                vm.armyList.statusType = 'status-ready';
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

            // Create the Grand Triumph min and max
            addGrandDataToTroopOptions(vm.armyList.troopOptions);

            vm.allyOptions = [];
            vm.troopContingents = [];
            results.allyOptions.forEach(function(option, index) {
                let contingentFlag = false;

                limitAllyOptionDateRange(option, vm.armyList.dateRanges[0], option.allyEntries);

                // Create the name for the ally option
                option.name = '';
                option.allyEntries.forEach(function(entry, index) {
                    entry.name = titleCase(entry.name);
                    // Add the entry name to the option name
                    if (index === 0) {
                        option.name = option.name + ' ' + entry.name;
                    }
                    else {
                        option.name = option.name + ' and ' + entry.name;
                    }

                    // Filter date ranges for the troop options vs the parent army list
                    entry.allyArmyList.troopOptions.forEach(function(troopOption) {
                        troopOption.dateRanges = limitTroopOptionDateRange(troopOption, vm.armyList.dateRanges[0], option.dateRange);
                    });

                    // Add Grand Triumph min max
                    addGrandDataToTroopOptions(entry.allyArmyList.troopOptions);

                    if (entry.allyArmyList.internalContingent) {
                        contingentFlag = true;

                        const contingent = {
                            name: entry.name,
                            dateRange: option.dateRange,
                            troopOptions: entry.allyArmyList.troopOptions
                        };

                        vm.troopContingents.push(contingent);
                    }
                });
                option.name = titleCase(option.name);

                if (!contingentFlag) {
                    vm.allyOptions.push(option);
                }
            });
        }
        else {
            // New army list
            vm.armyList = {
                name: "",
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

        vm.loading.armyList = false;

        vm.ruleSet = 'StandardTriumph';
    }

    function handleErrorResponse(reason) {
        console.log(reason);
        vm.loading.armyList = false;
        vm.loadFailed.armyList = true;
    }

    // DateRange
    //   null: no date range limit
    //   invalid = true: invalid date range
    //   otherwise, startDate to endDate, inclusive

    function addGrandDataToTroopOptions(troopOptions) {
        troopOptions.forEach(function(troopOption) {
            troopOption.minDouble = troopOption.min * 2;
            troopOption.maxDouble = troopOption.max * 2;
            troopOption.minTriple = troopOption.min * 3;
            troopOption.maxTriple = troopOption.max * 3;
        });
    }

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
        const overlappingDateRanges = [];
        for (const dateRange of troopOption.dateRanges) {
            let overlap = overlappingDateRange(dateRange, armyListDateRange);
            overlap = overlappingDateRange(overlap, allyOptionDateRange);

            if (!overlap.invalid) {
                if (allyOptionDateRange && overlap.startDate === allyOptionDateRange.startDate && overlap.endDate === allyOptionDateRange.endDate) {
                    // Overlap is identical to ally option date range. No specific date range required.
                    overlap = null;
                } else if (overlap.startDate === armyListDateRange.startDate && overlap.endDate === armyListDateRange.endDate) {
                    // No ally option date range and overlap is identical to army list date range. No specific date range required.
                    overlap = null;
                }
            }

            if (overlap && !overlap.invalid) {
                overlappingDateRanges.push(overlap);
            }
        }

        return overlappingDateRanges;
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

    vm.battleCards = BattleCardService.list();
    vm.showBattleCardRule = showBattleCardRule;
    function showBattleCardRule(battleCardCode) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: `views/modals/battleCardDisplay.html`,
            controller: 'BattleCardDisplayController',
            controllerAs: 'vm',
            resolve: {
                battleCard: function () {
                    var battleCard = vm.battleCards.find(card => card.permanentCode === battleCardCode);
                    return battleCard;
                }
            }
        });
    }
}
