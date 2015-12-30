'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListEditController', ArmyListEditController);

ArmyListEditController.$inject = ['$routeParams', '$location', 'ArmyListService', 'GrandArmyListService'];

function ArmyListEditController($routeParams, $location, ArmyListService, GrandArmyListService) {
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

    function initializeData() {
        if (listId) {
            // Get the army list data and then get the grand army lists.
            ArmyListService.get({ id: listId }, handleArmyList);
        }
        else {
            // New army list. Create the empty army list and get the grand army lists.
            vm.list = { name: "" };
            GrandArmyListService.list(handleGrandArmyLists);
        }
    }

    function handleArmyList(list) {
        // Save the army list and get the grand army lists.
        vm.list = list;
        vm.displayDateRanges = []
        for (var i = 0; i < list.date_ranges.length; ++i) {
            var dateRange = { startDate: list.date_ranges[i][0], endDate: list.date_ranges[i][1] };
            vm.displayDateRanges.push(dateRange);
        }
        GrandArmyListService.list(handleGrandArmyLists);
    }

    function handleGrandArmyLists(grandArmyLists) {
        vm.grandArmyLists = grandArmyLists;
        if (listId) {
            var galIndex = _.findIndex(vm.grandArmyLists, function (element) {
                return (element.id === vm.list.gal_id);
            });

            if (galIndex !== -1) {
                vm.galSelected = grandArmyLists[galIndex];
            }
            else {
                vm.galSelected = null;
            }
        }
    }

    function updateList() {
        if (vm.galSelected) {
            vm.list.gal_id = vm.galSelected.id;
        }
        else {
            vm.list.gal_id = null;
        }

        vm.list.date_ranges = [];
        for (var i = 0; i < vm.displayDateRanges.length; ++i) {
            var dateRangeObject = vm.displayDateRanges[i];
            var dateRangeArray = [ Number(dateRangeObject.startDate), Number(dateRangeObject.endDate) ];
            vm.list.date_ranges.push(dateRangeArray);
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
            vm.list.gal_id = vm.galSelected.id;
        }
        else {
            vm.list.gal_id = null;
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
        vm.displayDateRanges.push({ startDate: 0, endDate: 0 });
        console.info('added date range 0, 0');
    }
}