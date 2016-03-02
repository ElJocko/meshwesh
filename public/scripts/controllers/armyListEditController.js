'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListEditController', ArmyListEditController);

ArmyListEditController.$inject = ['$routeParams', '$location', '$q', '$uibModal', 'ArmyListService', 'GrandArmyListService'];

function ArmyListEditController($routeParams, $location, $q, $uibModal, ArmyListService, GrandArmyListService) {
    var vm = this;

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
            vm.list = results.armyList;

            // Find the grand army list that the army list belongs to
            if (vm.list.grandArmyList) {
                var galIndex = _.findIndex(vm.grandArmyLists, function (element) {
                    return (element.id === vm.list.grandArmyList);
                });

                if (galIndex !== -1) {
                    vm.galSelected = vm.grandArmyLists[galIndex];
                }
            }
        }
        else {
            // New army list
            vm.list = {
                name: "",
                grandArmyList: null,
                dateRanges: []
            };
        }
    }

    function updateList() {
        if (vm.galSelected) {
            vm.list.grandArmyList = vm.galSelected.id;
        }
        else {
            vm.list.grandArmyList = null;
        }

        ArmyListService.update({ id: listId }, vm.list,
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
            vm.list.grandArmyList = vm.galSelected.id;
        }
        else {
            vm.list.grandArmyList = null;
        }

        ArmyListService.create(vm.list,
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
                vm.list.dateRanges.push(resultDateRange);
            },
            function () {
                // Cancelled
            });
    }

    function editDateRange(dateRange) {
        var index = vm.list.dateRanges.indexOf(dateRange);
        if (index === -1) {
            // No matching date range!
            return;
        }

        var originalDateRange = vm.list.dateRanges[index];
        var editDateRange = {
            startDate: originalDateRange.startDate,
            endDate: originalDateRange.endDate
        };

        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'views/modals/dateRangeEdit.html',
            controller: 'DateRangeEditController',
            controllerAs: 'vm',
            size: 'sm',
            resolve: {
                dateRange: function () {
                    return editDateRange;
                }
            }
        });

        modalInstance.result.then(
            function (resultDateRange) {
                // Replace the old date range with the new date range
                //   angular.extend is necessary to trigger table update
                //   TBD: but still doesn't sort after update!?!
                angular.extend(originalDateRange, resultDateRange);
            },
            function () {
                // Cancelled
            });
    }

    function deleteDateRange(dateRange) {
        var index = vm.list.dateRanges.indexOf(dateRange);
        if (index !== -1) {
            vm.list.dateRanges.splice(index, 1);
        }
    }
}
