'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListEditController', ArmyListEditController);

ArmyListEditController.$inject = ['$routeParams', '$location', '$q', '$uibModal', 'uiGridConstants', 'ArmyListService', 'GrandArmyListService', 'TroopOptionsAnalysisService'];

function ArmyListEditController($routeParams, $location, $q, $uibModal, uiGridConstants, ArmyListService, GrandArmyListService, TroopOptionsAnalysisService) {
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

    if (listId) {
        // Edit an existing army list
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new army list
        vm.submit = createList;
        vm.delete = null;
    }

    vm.insertDateRange = insertDateRange;
    vm.editDateRange = editDateRange;
    vm.deleteDateRange = deleteDateRange;

    vm.insertInvasionRating = insertInvasionRating;
    vm.editInvasionRating = editInvasionRating;
    vm.deleteInvasionRating = deleteInvasionRating;

    vm.insertManeuverRating = insertManeuverRating;
    vm.editManeuverRating = editManeuverRating;
    vm.deleteManeuverRating = deleteManeuverRating;

    vm.insertTroopOption = insertTroopOption;
    vm.editTroopOption = editTroopOption;
    vm.deleteTroopOption = deleteTroopOption;

    function initializeDateRangeGrid() {
        var editTemplate = '<button type="button" ng-click="grid.appScope.vm.editDateRange(row.entity)" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-pencil"></i></button>';
        var deleteTemplate = '<button type="button" ng-click="grid.appScope.vm.deleteDateRange(row.entity)" class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-remove"></i></button>';

        vm.dateRangeGridOptions = {
            columnDefs: [
                { field: 'startDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC, priority: 0 }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'endDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'edt', displayName: '', cellClass: 'td-btn', cellTemplate: editTemplate,  enableSorting: false, width: 50, enableColumnMenu: false },
                { field: 'del', displayName: '', cellClass: 'td-btn', cellTemplate: deleteTemplate,  enableSorting: false, width: 50, enableColumnMenu: false }
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
        var editTemplate = '<button type="button" ng-click="grid.appScope.vm.editInvasionRating(row.entity)" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-pencil"></i></button>';
        var deleteTemplate = '<button type="button" ng-click="grid.appScope.vm.deleteInvasionRating(row.entity)" class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-remove"></i></button>';

        vm.invasionRatingGridOptions = {
            columnDefs: [
                { field: 'value', displayName: 'Value', type: 'number', sort: { direction: uiGridConstants.ASC, priority: 0 }, enableSorting: false, width: 90, enableColumnMenu: false },
                { field: 'note', displayName: 'Note', type: 'string', enableSorting: false, width: 160, enableColumnMenu: false },
                { field: 'edt', displayName: '', cellClass: 'td-btn', cellTemplate: editTemplate,  enableSorting: false, width: 50, enableColumnMenu: false },
                { field: 'del', displayName: '', cellClass: 'td-btn', cellTemplate: deleteTemplate,  enableSorting: false, width: 50, enableColumnMenu: false }
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
        var editTemplate = '<button type="button" ng-click="grid.appScope.vm.editManeuverRating(row.entity)" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-pencil"></i></button>';
        var deleteTemplate = '<button type="button" ng-click="grid.appScope.vm.deleteManeuverRating(row.entity)" class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-remove"></i></button>';

        vm.maneuverRatingGridOptions = {
            columnDefs: [
                { field: 'value', displayName: 'Value', type: 'number', sort: { direction: uiGridConstants.ASC, priority: 0 }, enableSorting: false, width: 90, enableColumnMenu: false },
                { field: 'note', displayName: 'Note', type: 'string', enableSorting: false, width: 160, enableColumnMenu: false },
                { field: 'edt', displayName: '', cellClass: 'td-btn', cellTemplate: editTemplate,  enableSorting: false, width: 50, enableColumnMenu: false },
                { field: 'del', displayName: '', cellClass: 'td-btn', cellTemplate: deleteTemplate,  enableSorting: false, width: 50, enableColumnMenu: false }
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
        var editTemplate = '<button type="button" ng-click="grid.appScope.vm.editTroopOption(row.entity)" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-pencil"></i></button>';
        var deleteTemplate = '<button type="button" ng-click="grid.appScope.vm.deleteTroopOption(row.entity)" class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-remove"></i></button>';

        vm.troopOptionGridOptions = {
            columnDefs: [
                { field: 'general', displayName: 'General?', type: 'boolean', cellClass: 'td-boolean-check', cellFilter: 'mwDisplayBooleanCheck', width: 80, enableColumnMenu: false },
                { field: 'core', displayName: 'Core?', type: 'boolean', cellClass: 'td-boolean-check', cellFilter: 'mwDisplayBooleanCheck', width: 80, enableColumnMenu: false },
                { field: 'min', displayName: 'Min', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'max', displayName: 'Max', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'troopEntries', displayName: 'Troop Entries', type: 'string', cellFilter: 'mwDisplayTroopTypeEntriesList', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 330, enableColumnMenu: false },
                { field: 'description', displayName: 'Description', type: 'string', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 200, enableColumnMenu: false },
                { field: 'startDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'endDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'edt', displayName: '', cellClass: 'td-btn', cellTemplate: editTemplate,  enableSorting: false, width: 50, enableColumnMenu: false },
                { field: 'del', displayName: '', cellClass: 'td-btn', cellTemplate: deleteTemplate,  enableSorting: false, width: 50, enableColumnMenu: false }
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
        if (listId) {
            armyListPromise = ArmyListService.get({ id: listId }).$promise;
        }

        // Get the grand army lists
        var grandArmyListsPromise = GrandArmyListService.list().$promise;

        // Handle the response after the services complete
        var servicePromises = {
            armyList: armyListPromise,
            grandArmyLists: grandArmyListsPromise
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

    function updateList() {
        if (vm.galSelected) {
            vm.armyList.grandArmyList = vm.galSelected.id;
        }
        else {
            vm.armyList.grandArmyList = null;
        }

        ArmyListService.update({ id: listId }, vm.armyList,
            function (list) {
                console.info('Successfully updated ' + list.name);
                $location.path('/armyList/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function createList() {
        if (vm.galSelected) {
            vm.armyList.grandArmyList = vm.galSelected.id;
        }
        else {
            vm.armyList.grandArmyList = null;
        }

        ArmyListService.create(vm.armyList,
            function(list) {
                console.info('Successfully created ' + list.name);
                $location.path('/armyList/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function deleteList() {
        ArmyListService.destroy({ id: listId },
            function(list) {
                console.info('Successfully deleted ' + list.name);
                $location.path('/armyList/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function insertDateRange() {
        // Initialize new date range
        var newDateRange = { startDate: 1, endDate: 100 };

        // Let the user edit the new date range
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/dateRangeEdit.html',
            controller: 'DateRangeEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                dateRange: function () {
                    return newDateRange;
                }
            }
        });

        // Insert the edited date range into the army list
        modalInstance.result.then(
            function (resultDateRange) {
                // Add the date range
                vm.armyList.dateRanges.push(resultDateRange);

                // Update the sort
                vm.dateRangeGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                resetGridHeight('date-range-grid', vm.armyList.dateRanges);
            },
            function () {
                // Cancelled
            });
    }

    function editDateRange(dateRange) {

        // Display the Edit Date Range modal
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/dateRangeEdit.html',
            controller: 'DateRangeEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                dateRange: function () {
                    return dateRange;
                }
            }
        });

        modalInstance.result.then(
            function (resultDateRange) {
                // Replace the old date range with the new date range
                dateRange.startDate = resultDateRange.startDate;
                dateRange.endDate = resultDateRange.endDate;

                // Update the sort
                vm.dateRangeGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            },
            function () {
                // Cancelled
            });
    }

    function deleteDateRange(dateRange) {
        var index = vm.armyList.dateRanges.indexOf(dateRange);
        if (index !== -1) {
            // Remove the date range
            vm.armyList.dateRanges.splice(index, 1);
            resetGridHeight('date-range-grid', vm.armyList.dateRanges);
        }
    }

    function insertTroopOption() {
        // Initialize new troop option
        var newTroopOption = {
            min: 0,
            max: 1,
            troopEntries: [],
            general: false,
            core: false,
            dateRange: {
                startDate: 0,
                endDate: 0
            },
            description: ""
        };

        // Let the user edit the new troop option
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/troopOptionEdit.html',
            controller: 'TroopOptionEditController',
            controllerAs: 'vm',
            resolve: {
                troopOption: function () {
                    return newTroopOption;
                }
            }
        });

        // Insert the edited troop option into the army list
        modalInstance.result.then(
            function (resultTroopOption) {
                // Add the troop option
                vm.armyList.troopOptions.push(resultTroopOption);

                // Update the sort
                vm.troopOptionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                resetGridHeight('troop-option-grid', vm.armyList.troopOptions);
            },
            function () {
                // Cancelled
            });
    }

    function editTroopOption(troopOption) {

        // Display the Edit Troop Option modal
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/troopOptionEdit.html',
            controller: 'TroopOptionEditController',
            controllerAs: 'vm',
            resolve: {
                troopOption: function () {
                    return troopOption;
                }
            }
        });

        modalInstance.result.then(
            function (resultTroopOption) {
                // Replace the old date range with the new date range
                troopOption.min = resultTroopOption.min;
                troopOption.max = resultTroopOption.max;
                troopOption.general = resultTroopOption.general;
                troopOption.core = resultTroopOption.core;
                troopOption.description = resultTroopOption.description;
                troopOption.troopEntries = resultTroopOption.troopEntries;

                // Update the sort
                vm.troopOptionsGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            },
            function () {
                // Cancelled
            });
    }

    function deleteTroopOption(troopOption) {
        var index = vm.armyList.troopOptions.indexOf(troopOption);
        if (index !== -1) {
            // Remove the date range
            vm.armyList.troopOptions.splice(index, 1);
            resetGridHeight('troop-option-grid', vm.armyList.troopOptions);
        }
    }

    function insertInvasionRating() {
        // Initialize rating
        var newRating = { value: 1, note: '' };

        // Let the user edit the new rating
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/ratingEdit.html',
            controller: 'RatingEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                rating: function () {
                    return newRating;
                },
                viewHeading: function () {
                    return 'Edit Invasion Rating'
                }
            }
        });

        // Insert the edited rating into the army list
        modalInstance.result.then(
            function (resultRating) {
                // Add the invasion rating
                vm.armyList.invasionRatings.push(resultRating);

                // Update the sort
                vm.invationRatingGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                resetGridHeight('invasion-rating-grid', vm.armyList.invasionRatings);
            },
            function () {
                // Cancelled
            });
    }

    function editInvasionRating(rating) {
        // Display the Edit Rating modal
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/ratingEdit.html',
            controller: 'RatingEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                rating: function () {
                    return rating;
                },
                viewHeading: function () {
                    return 'Edit Invasion Rating'
                }
            }
        });

        modalInstance.result.then(
            function (resultRating) {
                // Replace the old invasion rating with the new invasion rating
                rating.value = resultRating.value;
                rating.note = resultRating.note;

                // Update the sort
                vm.invationRatingGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            },
            function () {
                // Cancelled
            });
    }

    function deleteInvasionRating(rating) {
        var index = vm.armyList.invasionRatings.indexOf(rating);
        if (index !== -1) {
            // Remove the invasion rating
            vm.armyList.invasionRatings.splice(index, 1);
            resetGridHeight('invasion-rating-grid', vm.armyList.invasionRatings);
        }
    }

    function insertManeuverRating() {
        var newRating = { value: 1, note: '' };

        // Let the user edit the new rating
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/ratingEdit.html',
            controller: 'RatingEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                rating: function () {
                    return newRating;
                },
                viewHeading: function () {
                    return 'Edit Maneuver Rating'
                }
            }
        });

        // Insert the edited rating into the army list
        modalInstance.result.then(
            function (resultRating) {
                // Add the invasion rating
                vm.armyList.maneuverRatings.push(resultRating);

                // Update the sort
                vm.maneuverRatingGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                resetGridHeight('invasion-rating-grid', vm.armyList.maneuverRatings);
            },
            function () {
                // Cancelled
            });
    }

    function editManeuverRating(rating) {
        // Display the Edit Rating modal
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/ratingEdit.html',
            controller: 'RatingEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                rating: function () {
                    return rating;
                },
                viewHeading: function () {
                    return 'Edit Maneuver Rating'
                }
            }
        });

        modalInstance.result.then(
            function (resultRating) {
                // Replace the old rating with the modified rating
                rating.value = resultRating.value;
                rating.note = resultRating.note;

                // Update the sort
                vm.maneuverRatingGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            },
            function () {
                // Cancelled
            });
    }

    function deleteManeuverRating(rating) {
        var index = vm.armyList.maneuverRatings.indexOf(rating);
        if (index !== -1) {
            // Remove the rating
            vm.armyList.maneuverRatings.splice(index, 1);
            resetGridHeight('maneuver-rating-grid', vm.armyList.maneuverRatings);
        }
    }

    function performAnalysis() {
        vm.totalMinMax = TroopOptionsAnalysisService.calculateTotalMinMaxPoints(vm.armyList.troopOptions);
    }
}
