'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListEditController', ArmyListEditController);

ArmyListEditController.$inject = ['$routeParams', '$location', '$q', '$uibModal', 'uiGridConstants', 'ArmyListService', 'GrandArmyListService'];

function ArmyListEditController($routeParams, $location, $q, $uibModal, uiGridConstants, ArmyListService, GrandArmyListService) {
    var vm = this;

    initializeDateRangeGrid();
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

    function initializeTroopOptionsGrid() {
        var editTemplate = '<button type="button" ng-click="grid.appScope.vm.editTroopOption(row.entity)" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-pencil"></i></button>';
        var deleteTemplate = '<button type="button" ng-click="grid.appScope.vm.deleteTroopOption(row.entity)" class="btn btn-sm btn-danger"><i class="glyphicon glyphicon-remove"></i></button>';

        vm.troopOptionGridOptions = {
            columnDefs: [
                { field: 'min', displayName: 'Min', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'max', displayName: 'Max', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 80, enableColumnMenu: false },
                { field: 'troopTypes', displayName: 'Troop Types', type: 'string', cellFilter: 'mwDisplayTroopTypesList', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 330, enableColumnMenu: false },
                { field: 'startDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'endDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false },
                { field: 'description', displayName: 'Description', type: 'string', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 200, enableColumnMenu: false },
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

    function resetDateRangeGridHeight() {
        // TBD: Grid only shows rows for initial height (in .css). Set to 2000px as workaround. Need to
        // find a way to tell the grid that it has a new size.
        var height = (vm.armyList.dateRanges.length * 35) + 32;

        var gridElement = document.getElementById('date-range-grid');
        if (gridElement) {
            angular.element(gridElement).css('height', height + 'px');
        }

        // TBD: how to distinguish ui-grid-viewport elements???
        var gridViewport = document.getElementsByClassName('ui-grid-viewport');
        if (gridViewport) {
            angular.element(gridViewport[0]).css('height', height + 'px');
        }
    }

    function resetTroopOptionsGridHeight() {
        // TBD: Grid only shows rows for initial height (in .css). Set to 2000px as workaround. Need to
        // find a way to tell the grid that it has a new size.
        var height = (vm.armyList.troopOptions.length * 35) + 32;


        var gridElement = document.getElementById('troop-options-grid');
        if (gridElement) {
            angular.element(gridElement).css('height', height + 'px');
        }

        var gridViewport = document.getElementsByClassName('ui-grid-viewport');
        if (gridViewport) {
            angular.element(gridViewport[1]).css('height', height + 'px');
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
                dateRanges: []
            };
        }

        vm.dateRangeGridOptions.data = vm.armyList.dateRanges;
        vm.troopOptionGridOptions.data = vm.armyList.troopOptions;
        resetDateRangeGridHeight();
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
            animation: false,
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
                resetDateRangeGridHeight();
            },
            function () {
                // Cancelled
            });
    }

    function editDateRange(dateRange) {

        // Display the Edit Date Range modal
        var modalInstance = $uibModal.open({
            animation: false,
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
            resetDateRangeGridHeight();
        }
    }

    function insertTroopOption() {
        // Initialize new troop option
        var newTroopOption = {
            min: 0,
            max: 1,
            troopTypes: [],
            dateRange: {
                startDate: 0,
                endDate: 0
            },
            description: ""
        };

        // Let the user edit the new troop option
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'views/modals/troopOptionEdit.html',
            controller: 'TroopOptionEditController',
            controllerAs: 'vm',
//            size: 'sm',
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
                resetTroopOptionsGridHeight();
            },
            function () {
                // Cancelled
            });
    }

    function editTroopOption(troopOption) {

        // Display the Edit Troop Option modal
        var modalInstance = $uibModal.open({
            animation: false,
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
                troopOption.description = resultTroopOption.description;
                troopOption.troopTypes = resultTroopOption.troopTypes;

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
            resetTroopOptionsGridHeight();
        }
    }
}
