'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListMinMaxReportController', ArmyListMinMaxReportController);

ArmyListMinMaxReportController.$inject = ['$location', 'uiGridConstants', 'ArmyListService', 'TroopOptionsAnalysisService'];

function ArmyListMinMaxReportController($location, uiGridConstants, ArmyListService, TroopOptionsAnalysisService) {
    var vm = this;

    vm.edit = showEditArmyList;
    vm.searchChanged = searchChanged;

    initializeArmyListGrid();
    ArmyListService.list(function(armyLists) {
        vm.armyLists = armyLists;
        vm.armyLists.forEach(function(item) {
            item.analysisData = TroopOptionsAnalysisService.calculateTotalMinMaxPoints(item.troopOptions);
        });
        vm.armyListReportGridOptions.data = vm.armyLists;
    });

    function showEditArmyList(listId) {
        $location.path('/armyList/' + listId + '/edit');
    }

    function searchChanged() {
        vm.armyListReportGridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
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
        vm.armyListReportGridOptions = {
            columnDefs: [
                { field: 'name', displayName: 'Army List Name', cellTemplate: nameTemplate, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 300, enableColumnMenu: false, enableFiltering: false, filter: nameFilter },
                { field: 'derivedData.listStartDate', displayName: 'Start Date', type: 'number', cellFilter: 'mwDisplayYear', sort: { direction: uiGridConstants.ASC }, sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'derivedData.listEndDate', displayName: 'End Date', type: 'number', cellFilter: 'mwDisplayYear', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'analysisData.minPoints', cellClass: getCellClass, displayName: 'Min Points', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false },
                { field: 'analysisData.maxPoints', cellClass: getCellClass, displayName: 'Max Points', type: 'number', sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC], width: 110, enableColumnMenu: false, enableFiltering: false }
            ],
            rowHeight: 35,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.armyListReportGridApi = gridApi;
            }
        };
    }

    function getCellClass(grid, row, column, rowRenderIndex, colRenderIndex) {
        //console.log(row);
        //console.log(column);
        //console.log(colRenderIndex);
        var className = '';

        if (column.field === 'analysisData.minPoints') {
            if (row.entity.analysisData.minPoints > 48) {
                className = 'td-warn';
            }
        }
        else if (column.field === 'analysisData.maxPoints') {
            if (row.entity.analysisData.maxPoints < 48) {
                className = 'td-warn';
            }
        }

        return className;
    }
}
