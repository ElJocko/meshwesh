'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListSummaryController', ArmyListSummaryController);

ArmyListSummaryController.$inject = ['$location', 'uiGridConstants', 'ArmyListService', 'mode'];

function ArmyListSummaryController($location, uiGridConstants, ArmyListService, mode) {
    var vm = this;

    if (mode === 'edit') {
        vm.create = showCreateArmyList;
        vm.onClickArmyList = showEditArmyList;
    }
    else if (mode === 'explore') {
        vm.create = null;
        vm.onClickArmyList = showExploreArmyList;
    }

    initializeArmyListGrid();

    ArmyListService.list(function(armyLists) {
        vm.armyLists = armyLists;
        vm.armyListGridOptions.data = vm.armyLists;
    });

    restoreGridState();

    function showCreateArmyList() {
        $location.path('/armyList/create');
        clearGridState();
    }

    function showEditArmyList(listId) {
        $location.path('/armyList/' + listId + '/edit');
        clearGridState();
    }

    function showExploreArmyList(listId) {
        $location.path('/armyList/' + listId + '/explore');
        clearGridState();
    }

    vm.searchChanged = searchChanged;
    function searchChanged() {
        saveGridState();
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

        var nameTemplate = '<div class="td-anchor"><a href ng-click="grid.appScope.vm.onClickArmyList(row.entity.id)">{{ row.entity.name }}</a></div>';
        vm.armyListGridOptions = {
            columnDefs: [
                { field: 'name', displayName: 'Army List Name', cellTemplate: nameTemplate, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 300, enableColumnMenu: false, enableFiltering: false, filter: nameFilter },
                { field: 'derivedData.listStartDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'derivedData.listEndDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false }
            ],
            rowHeight: 35,
            enableFiltering: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.armyListGridApi = gridApi;
            }
        };
    }

    function saveGridState() {
        $location.replace();
        if (vm.searchName) {
            $location.search('searchText', vm.searchName);
        }
        else {
            $location.search('searchText', null);
        }
    }

    function restoreGridState() {
        var search = $location.search();
        vm.searchName = search.searchText
    }

    function clearGridState() {
        $location.search('searchText', null);
    }
}
