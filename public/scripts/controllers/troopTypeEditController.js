'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopTypeEditController', TroopTypeEditController);

TroopTypeEditController.$inject = ['$routeParams', '$location', 'TroopTypeService', 'mwDisplayTroopTypesListFilter', 'mwDisplayTroopTypesFilter'];

function TroopTypeEditController($routeParams, $location, TroopTypeService, mwDisplayTroopTypesListFilter, mwDisplayTroopTypesFilter) {
    var vm = this;

    var troopTypeId = $routeParams.troopTypeId;
    if (troopTypeId) {
        // Edit an existing troop type
        vm.troopType = TroopTypeService.get({ id: troopTypeId });
        vm.submit = updateTroopType;
        vm.delete = deleteTroopType;
    }
    else {
        // Edit a new troop type
        vm.troopType = {
            permanentCode: "",
            displayName: ""
        };
        vm.submit = createTroopType;
    }

    vm.costOptions = [ 2, 3, 4 ];
    vm.categoryOptions = [ 'foot', 'mounted' ];

    function updateTroopType() {
        TroopTypeService.update({ id: troopTypeId }, vm.troopType,
            function (troopType) {
                reloadFilters();
                console.info('Successfully updated ' + troopType.displayName);
                $location.path('/troopType/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function createTroopType() {
        TroopTypeService.create(vm.troopType,
            function (troopType) {
                reloadFilters();
                console.info('Successfully created ' + troopType.displayName);
                $location.path('/troopType/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function deleteTroopType() {
        TroopTypeService.destroy({ id: troopTypeId },
            function (troopType) {
                reloadFilters();
                console.info('Successfully deleted ' + troopType.displayName);
                $location.path('/troopType/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function reloadFilters() {
        mwDisplayTroopTypesListFilter.reloadData();
        mwDisplayTroopTypesFilter.reloadData();
    }
}