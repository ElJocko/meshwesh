'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopOptionEditController', TroopOptionEditController);

function TroopOptionEditController($uibModalInstance, $timeout, uiGridConstants, TroopTypeService, troopOption) {
    var vm = this;

    vm.troopOption = troopOption;

    // Make sure the general and core properties are set
    if (!vm.troopOption.general) {
        vm.troopOption.general = false;
    }

    if (!vm.troopOption.core) {
        vm.troopOption.core = false;
    }

    vm.yesNoOptions = [
        { label: 'yes', value: true },
        { label: 'no', value: false }
    ];

    vm.minPoints = 0;
    vm.maxPoints = 0;

    var enableOnSelect = true;

    initializeTroopTypeGrid();
    initializeTroopTypeData();

    function initializeCurrentTroopTypeSelection() {

        $timeout(function() {
            // Don't act on the rowSelectionChanged event
            enableOnSelect = false;

            // Select the troop types in the starting data
            vm.troopTypeGridOptions.data.forEach(function(value) {
                var index = vm.troopOption.troopTypes.indexOf(value.permanentCode);
                if (index >= 0) {
                    vm.troopTypeGridApi.selection.selectRow(value);
                }
            });

            calculateMinMaxPoints();

            // Enable handling selection events
            enableOnSelect = true;
        });
    }

    function initializeTroopTypeGrid() {
        vm.troopTypeGridOptions = {
            columnDefs: [
                { field: 'displayName', displayName: 'Troop Type', type: 'string', sort: { direction: uiGridConstants.ASC, priority: 1 }, enableSorting: false, width: 120 },
                { field: 'category', displayName: 'Category', type: 'string', sort: { direction: uiGridConstants.ASC, priority: 0 }, enableSorting: false, width: 80 },
                { field: 'cost', displayName: 'Cost', type: 'number', enableSorting: false, width: 60 }
            ],
            rowHeight: 35,
            enableColumnMenus: false,
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
        TroopTypeService.list(function(availableTroopTypes) {
            vm.troopTypeGridOptions.data = availableTroopTypes;
            vm.availableTroopTypes = availableTroopTypes;
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
            min: vm.troopOption.min,
            max: vm.troopOption.max,
            general: vm.troopOption.general,
            core: vm.troopOption.core,
            description: vm.troopOption.description,
            troopTypes: vm.troopOption.troopTypes
        };
        $uibModalInstance.close(updatedTroopOption);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.minMaxChanged = function() {
        vm.editForm.inputMax.$setValidity("minMaxOrder", vm.troopOption.max >= vm.troopOption.min);
        calculateMinMaxPoints();
    };

    function addTroopType(troopType) {
        vm.troopOption.troopTypes.push(troopType);
        calculateMinMaxPoints();
    }

    function removeTroopType(troopType) {
        var index = vm.troopOption.troopTypes.indexOf(troopType);
        if (index !== -1) {
            // Remove the date range
            vm.troopOption.troopTypes.splice(index, 1);
            calculateMinMaxPoints();
        }
    }

    function findTroopTypeByPermanentCode(code) {
        var troopType = null;
        vm.availableTroopTypes.forEach(function(item) {
            if (item.permanentCode === code) {
                troopType = item;
            }
        });
        return troopType;
    }

    function calculateMinMaxPoints() {
        if (vm.troopOption.troopTypes.length === 0) {
            vm.minPoints = 0;
            vm.maxPoints = 0;
        }
        else {
            var minCost = 99;
            var maxCost = 0;

            vm.troopOption.troopTypes.forEach(function(item) {
                var troopType = findTroopTypeByPermanentCode(item);
                if (troopType) {
                    if (troopType.cost < minCost) {
                        minCost = troopType.cost;
                    }
                    if (troopType.cost > maxCost) {
                        maxCost = troopType.cost;
                    }
                }
            });

            vm.minPoints = minCost * vm.troopOption.min;
            vm.maxPoints = maxCost * vm.troopOption.max;
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

