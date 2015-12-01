'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListsListController', ArmyListsListController);

ArmyListsListController.$inject = ['$location', 'ArmyListsService'];

function ArmyListsListController($location, ArmyListsService) {
    var vm = this;

    vm.lists = ArmyListsService.list();
    vm.create = showCreateArmyList;
    vm.edit = showEditArmyList;

    function showCreateArmyList() {
        $location.path('/armyLists/create');
    }

    function showEditArmyList(listId) {
        $location.path('/armyLists/' + listId + '/edit');
    }
}