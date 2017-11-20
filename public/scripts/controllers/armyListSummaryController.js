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

    // Start with keywords enabled
    vm.includeKeywords = true;

    initializeArmyListGrid();

    ArmyListService.listSummary(function(armyLists) {
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

        function searchFilter(renderableRows) {
            if (vm.searchName == null || vm.searchName.length === 0) {
                // No search term; shortcut filter
                return renderableRows;
            }
            else {
                renderableRows.forEach(function(row) {
                    row.visible = false;
                    if (row.entity.name.toLowerCase().indexOf(vm.searchName.toLowerCase()) != -1) {
                        row.visible = true;
                    }
                    else if (vm.includeKeywords) {
                        row.entity.keywords.forEach(function(keyword) {
                            if (keyword.toLowerCase().indexOf(vm.searchName.toLowerCase()) != -1) {
                                row.visible = true;
                            }
                        })
                    }
                });

                return renderableRows;
            }
        }

        var nameTemplate = '<div class="td-anchor"><a href ng-click="grid.appScope.vm.onClickArmyList(row.entity.id)">{{ row.entity.name }}</a></div>';
        vm.armyListGridOptions = {
            columnDefs: [
                { field: 'name', displayName: 'Army List Name', cellTemplate: nameTemplate, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 300, enableColumnMenu: false, enableFiltering: false },
                { field: 'derivedData.listStartDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'derivedData.listEndDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false }
            ],
            rowHeight: 35,
            enableFiltering: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.armyListGridApi = gridApi;
                vm.armyListGridApi.grid.registerRowsProcessor(searchFilter, 200);
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

        if (vm.includeKeywords) {
            $location.search('includeKeywords', 'true');
        }
        else {
            $location.search('includeKeywords', null);
        }
    }

    function restoreGridState() {
        var search = $location.search();
        vm.searchName = search.searchText;
        if (search.includeKeywords === 'true') {
            vm.includeKeywords = true;
        }
        else {
            vm.includeKeywords = false;
        }
    }

    function clearGridState() {
        $location.search('searchText', null);
        $location.search('includeKeywords', null);
    }
}
