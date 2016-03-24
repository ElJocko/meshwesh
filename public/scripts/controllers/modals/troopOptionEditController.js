'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopOptionEditController', TroopOptionEditController);

function TroopOptionEditController($uibModalInstance, $timeout, TroopTypeService, troopOption) {
    var vm = this;

    vm.min = troopOption.min;
    vm.max = troopOption.max;
    vm.description = troopOption.description;
    vm.troopTypes = troopOption.troopTypes;

    var enableOnSelect = true;

    initializeTroopTypeGrid();
    initializeTroopTypeData();

    function initializeCurrentTroopTypeSelection() {

        $timeout(function() {
            // Don't act on the rowSelectionChanged event
            enableOnSelect = false;

            // Select the troop types in the starting data
            vm.troopTypeGridOptions.data.forEach(function(value) {
                var index = vm.troopTypes.indexOf(value.permanentCode);
                if (index >= 0) {
                    vm.troopTypeGridApi.selection.selectRow(value);
                }
            });

            // Enable handling selection events
            enableOnSelect = true;
        });
    }

    function initializeTroopTypeGrid() {
        vm.troopTypeGridOptions = {
            columnDefs: [
                { field: 'displayName', displayName: 'Troop Type', type: 'string', enableSorting: false, width: 120, enableColumnMenu: false },
                { field: 'category', displayName: 'Category', type: 'string', enableSorting: false, width: 80, enableColumnMenu: false },
                { field: 'cost', displayName: 'Cost', type: 'number', enableSorting: false, width: 60, enableColumnMenu: false }
            ],
            rowHeight: 35,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 1,
            enableRowSelection: true,
            enableSelectAll: false,
            selectionRowHeaderWidth: 35,
            multiselect: true,
            enableFullRowSelection: true,
            appScopeProvider: this,
            onRegisterApi: function(gridApi) {
                vm.troopTypeGridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(null, function(row) {
                    if (enableOnSelect) {
                        if (row.isSelected) {
                            addTroopType(row.entity.permanentCode);
                        }
                        else {
                            removeTroopType(row.entity.permanentCode);
                        }
                    }
                });
            }
        };
    }

    function initializeTroopTypeData() {
        TroopTypeService.list(function(troopTypes) {
            vm.troopTypeGridOptions.data = troopTypes;
            initializeCurrentTroopTypeSelection();
        });
    }
/*
    vm.expandedDateRange = expandDateRange(troopOption.dateRange);

    vm.setStartPeriod = function(period) {
        vm.expandedDateRange.startDatePeriod = period;
        vm.dateChanged();
    };

    vm.setEndPeriod = function(period) {
        vm.expandedDateRange.endDatePeriod = period;
        vm.dateChanged();
    };
*/

    vm.ok = function () {
        var updatedTroopOption = {
            min: vm.min,
            max: vm.max,
            description: vm.description,
            troopTypes: vm.troopTypes
        };
        $uibModalInstance.close(updatedTroopOption);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.minMaxChanged = function() {
        vm.editForm.inputMax.$setValidity("minMaxOrder", vm.max >= vm.min);
    };

    function addTroopType(troopType) {
        vm.troopTypes.push(troopType);
    }

    function removeTroopType(troopType) {
        var index = vm.troopTypes.indexOf(troopType);
        if (index !== -1) {
            // Remove the date range
            vm.troopTypes.splice(index, 1);
        }
    }
}

function checkDateOrder(expandedDateRange) {
    var dateRange = unexpandDateRange(expandedDateRange);
    if (dateRange.startDate && dateRange.endDate) {
        return (dateRange.endDate > dateRange.startDate);
    }
    else {
        // Always true if not able to compare numbers
        // This allows another validation message to be displayed
        return true;
    }
}

function expandDateRange(dateRange) {
    // Create the expanded date range
    //   -100 becomes { 100, "BC" }
    var startPeriod = "AD";
    if (dateRange.startDate < 0) {
        startPeriod = "BC";
    }

    var endPeriod = "AD";
    if (dateRange.endDate < 0) {
        endPeriod = "BC";
    }

    var expandedDateRange = {
        startDateYear: Math.abs(dateRange.startDate),
        startDatePeriod: startPeriod,
        endDateYear:  Math.abs(dateRange.endDate),
        endDatePeriod: endPeriod
    };

    return expandedDateRange;
}

function unexpandDateRange(expandedDateRange) {
    var dateRange = {
        startDate: expandedDateRange.startDateYear,
        endDate: expandedDateRange.endDateYear
    };

    if (expandedDateRange.startDatePeriod === "BC") {
        dateRange.startDate = dateRange.startDate * -1;
    }

    if (expandedDateRange.endDatePeriod === "BC") {
        dateRange.endDate = dateRange.endDate * -1;
    }

    return dateRange;
}

