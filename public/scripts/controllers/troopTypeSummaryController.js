'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopTypeSummaryController', TroopTypeSummaryController);

TroopTypeSummaryController.$inject = ['$location', 'TroopTypeService'];

function TroopTypeSummaryController($location, TroopTypeService) {
    var vm = this;

    vm.troopTypes = TroopTypeService.list();
    vm.create = showCreateTroopType;
    vm.edit = showEditTroopType;

    function showCreateTroopType() {
        $location.path('/troopType/create');
    }

    function showEditTroopType(troopTypeId) {
        $location.path('/troopType/' + troopTypeId + '/edit');
    }
}