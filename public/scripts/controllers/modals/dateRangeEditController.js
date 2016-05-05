'use strict';

angular
    .module('meshweshControllers')
    .controller('DateRangeEditController', DateRangeEditController);

function DateRangeEditController($uibModalInstance, dateRange) {
    var vm = this;

    vm.expandedDateRange = expandDateRange(dateRange);

    vm.setStartPeriod = function(period) {
        vm.expandedDateRange.startDatePeriod = period;
        vm.dateChanged();
    };

    vm.setEndPeriod = function(period) {
        vm.expandedDateRange.endDatePeriod = period;
        vm.dateChanged();
    };

    vm.ok = function () {
        var updatedDateRange = unexpandDateRange(vm.expandedDateRange);
        $uibModalInstance.close(updatedDateRange);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    vm.dateChanged = function() {
        vm.editDateRangeForm.inputEndDateYear.$setValidity("dateOrder", checkDateOrder(vm.expandedDateRange));
    };

    function checkDateOrder(expandedDateRange) {
        var dateRange = unexpandDateRange(expandedDateRange);
        if (dateRange.startDate && dateRange.endDate) {
            return (dateRange.endDate >= dateRange.startDate);
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
}

