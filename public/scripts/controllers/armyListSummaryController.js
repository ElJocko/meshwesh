'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListSummaryController', ArmyListSummaryController);

ArmyListSummaryController.$inject = ['$location', 'uiGridConstants', 'ArmyListService'];

function ArmyListSummaryController($location, uiGridConstants, ArmyListService) {
    var vm = this;

    vm.create = showCreateArmyList;
    vm.edit = showEditArmyList;
    vm.searchChanged = searchChanged;

    initializeArmyListGrid();
    ArmyListService.list(function(armyLists) {
        vm.armyLists = armyLists;
        vm.armyListGridOptions.data = vm.armyLists;
    });

    function showCreateArmyList() {
        $location.path('/armyList/create');
    }

    function showEditArmyList(listId) {
        $location.path('/armyList/' + listId + '/edit');
    }

    function searchChanged() {
        vm.armyListGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }

    function initializeArmyListGrid() {
        var nameFilter = {
            noTerm: true,
            condition: function (searchTerm, cellValue) {
                if (vm.searchName == null || vm.searchName.length === 0) {
                    return true;
                } else {
                    return (cellValue.toLowerCase().indexOf(vm.searchName.toLowerCase()) != -1);
                }
            }
        };

        var nameTemplate = '<div class="td-anchor"><a href ng-click="grid.appScope.vm.edit(row.entity.id)">{{ row.entity.name }}</a></div>';
        vm.armyListGridOptions = {
            columnDefs: [
                { field: 'name', displayName: 'Army List Name', cellTemplate: nameTemplate, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 300, enableColumnMenu: false, enableFiltering: false, filter: nameFilter },
                { field: 'listStartDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'listEndDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false }
            ],
            rowHeight: 35,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
//            enableVerticalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.armyListGridApi = gridApi;
            }
        };
    }

}
