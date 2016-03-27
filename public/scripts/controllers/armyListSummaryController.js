'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListSummaryController', ArmyListSummaryController);

ArmyListSummaryController.$inject = ['$location', 'ArmyListService'];

function ArmyListSummaryController($location, ArmyListService) {
    var vm = this;

    vm.armyLists = ArmyListService.list();
    vm.create = showCreateArmyList;
    vm.edit = showEditArmyList;

    function showCreateArmyList() {
        $location.path('/armyList/create');
    }

    function showEditArmyList(listId) {
        $location.path('/armyList/' + listId + '/edit');
    }
}
