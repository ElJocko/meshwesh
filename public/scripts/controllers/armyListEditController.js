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
                vm.armyList.dateRanges.push(resultDateRange);
            },
            function () {
                // Cancelled
            });
    }

    function editDateRange(dateRange) {
        var index = vm.armyList.dateRanges.indexOf(dateRange);
        if (index === -1) {
            // No matching date range!
            return;
        }

        var originalDateRange = vm.armyList.dateRanges[index];
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
                // TBD: Force table sort
                originalDateRange.startDate = resultDateRange.startDate;
                originalDateRange.endDate = resultDateRange.endDate;
            },
            function () {
                // Cancelled
            });
    }

    function deleteDateRange(dateRange) {
        var index = vm.armyList.dateRanges.indexOf(dateRange);
        if (index !== -1) {
            vm.armyList.dateRanges.splice(index, 1);
        }
    }
}
