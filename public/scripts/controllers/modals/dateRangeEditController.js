'use strict';

angular
    .module('meshweshControllers')
    .controller('DateRangeEditController', DateRangeEditController);

function DateRangeEditController($uibModalInstance, dateRange) {
    var vm = this;

    var startPeriod = "AD";
    if (dateRange.startDate < 0) {
        startPeriod = "BC";
    }

    var endPeriod = "AD";
    if (dateRange.endDate < 0) {
        endPeriod = "BC";
    }

    vm.expandedDateRange = {
        startDateYear: Math.abs(dateRange.startDate),
        startDatePeriod: startPeriod,
        endDateYear:  Math.abs(dateRange.endDate),
        endDatePeriod: endPeriod
    };

    vm.setStartPeriod = function(period) {
        vm.expandedDateRange.startDatePeriod = period;
    };

    vm.setEndPeriod = function(period) {
        vm.expandedDateRange.endDatePeriod = period;
    };

    vm.ok = function () {
        var updatedDateRange = {
            startDate: vm.expandedDateRange.startDateYear,
            endDate: vm.expandedDateRange.endDateYear
        };

        if (vm.expandedDateRange.startDatePeriod === "BC") {
            updatedDateRange.startDate = updatedDateRange.startDate * -1;
        }

        if (vm.expandedDateRange.endDatePeriod === "BC") {
            updatedDateRange.endDate = updatedDateRange.endDate * -1;
        }

        $uibModalInstance.close(updatedDateRange);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}

