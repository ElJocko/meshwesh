'use strict';

angular
    .module('meshweshControllers')
    .controller('GrandArmyListsListController', GrandArmyListsListController);

GrandArmyListsListController.$inject = ['$location', 'GrandArmyListsService'];

function GrandArmyListsListController($location, GrandArmyListsService) {
    var vm = this;

    vm.lists = GrandArmyListsService.list();
    vm.create = showCreateGrandArmyList;
    vm.edit = showEditGrandArmyList;

    function showCreateGrandArmyList() {
        $location.path('/grandArmyLists/create');
    }

    function showEditGrandArmyList(listId) {
        $location.path('/grandArmyLists/' + listId + '/edit');
    }
}