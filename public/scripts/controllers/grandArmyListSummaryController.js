'use strict';

angular
    .module('meshweshControllers')
    .controller('GrandArmyListSummaryController', GrandArmyListSummaryController);

GrandArmyListSummaryController.$inject = ['$location', 'GrandArmyListService'];

function GrandArmyListSummaryController($location, GrandArmyListService) {
    var vm = this;

    vm.lists = GrandArmyListService.list();
    vm.create = showCreateGrandArmyList;
    vm.edit = showEditGrandArmyList;

    function showCreateGrandArmyList() {
        $location.path('/grandArmyList/create');
    }

    function showEditGrandArmyList(listId) {
        $location.path('/grandArmyList/' + listId + '/edit');
    }
}