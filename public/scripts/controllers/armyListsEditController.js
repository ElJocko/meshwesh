'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListsEditController', ArmyListsEditController);

ArmyListsEditController.$inject = ['$routeParams', '$location', 'ArmyListsService', 'GrandArmyListsService'];

function ArmyListsEditController($routeParams, $location, ArmyListsService, GrandArmyListsService) {
    var vm = this;

    var listId = $routeParams.listId;
    if (listId) {
        // Edit an existing army list
        vm.list = ArmyListsService.get({ id: listId });
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new army list
        vm.list = { name: "" };
        vm.submit = createList;
    }
    GrandArmyListsService.list(setSelectedGrandArmyList);

    function setSelectedGrandArmyList(grandArmyLists) {
        vm.grandArmyLists = grandArmyLists;
        var galIndex = vm.grandArmyLists.findIndex(function(element, index, array) {
            return (element.id === vm.list.gal_id);
        });
        if (galIndex !== -1) {
            vm.galSelected = grandArmyLists[galIndex];
        }
        else {
            vm.galSelected = null;
        }
    }

    function updateList() {
        if (vm.galSelected) {
            vm.list.gal_id = vm.galSelected.id;
        }
        else {
            vm.list.gal_id = null;
        }
        ArmyListsService.update({ id: listId }, vm.list,
            function (list) {
                console.log('Successfully updated ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function createList() {
        if (vm.galSelected) {
            vm.list.gal_id = vm.galSelected.id;
        }
        else {
            vm.list.gal_id = null;
        }
        ArmyListsService.create(vm.list,
            function(list) {
                console.log('Successfully created ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function deleteList() {
        ArmyListsService.destroy({ id: listId },
            function(list) {
                console.log('Successfully deleted ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }
}