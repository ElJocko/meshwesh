'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListEditController', ArmyListEditController);

ArmyListEditController.$inject = ['$routeParams', '$location', 'ArmyListService', 'GrandArmyListService'];

function ArmyListEditController($routeParams, $location, ArmyListService, GrandArmyListService) {
    var vm = this;

    var listId = $routeParams.listId;
    if (listId) {
        // Edit an existing army list
        vm.list = ArmyListService.get({ id: listId });
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new army list
        vm.list = { name: "" };
        vm.submit = createList;
    }
    GrandArmyListService.list(setSelectedGrandArmyList);

    function setSelectedGrandArmyList(grandArmyLists) {
        vm.grandArmyLists = grandArmyLists;
        var galIndex = _.findIndex(vm.grandArmyLists, function(element) {
            return (element.id === vm.list.gal_id);
        });
//        var galIndex = vm.grandArmyLists.findIndex(function(element, index, array) {
//            return (element.id === vm.list.gal_id);
//        });
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
        ArmyListService.update({ id: listId }, vm.list,
            function (list) {
                console.log('Successfully updated ' + list.name);
                $location.path('/armyList/summary');
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
        ArmyListService.create(vm.list,
            function(list) {
                console.log('Successfully created ' + list.name);
                $location.path('/armyList/summary');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function deleteList() {
        ArmyListService.destroy({ id: listId },
            function(list) {
                console.log('Successfully deleted ' + list.name);
                $location.path('/armyList/summary');
            },
            function (res) {
                console.log(res.data);
            });
    }
}