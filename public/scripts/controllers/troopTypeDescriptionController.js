'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopTypeDescriptionController', TroopTypeDescriptionController);

TroopTypeDescriptionController.$inject = ['$location', 'TroopTypeService'];

function TroopTypeDescriptionController($location, TroopTypeService) {
    var vm = this;

    vm.troopTypes = {};
    initializeTroopTypeData();

    function initializeTroopTypeData() {
        TroopTypeService.list(function(availableTroopTypes) {
            availableTroopTypes.forEach(function (item) {
                vm.troopTypes[item.permanentCode] = item;
            });
        });
    }



}