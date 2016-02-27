'use strict';

angular
    .module('meshweshControllers')
    .controller('DateRangeEditController', DateRangeEditController);

function DateRangeEditController($uibModalInstance, dateRange) {
    var vm = this;

    vm.expandedDateRange = {
        startDateYear: Math.abs(dateRange.startDate),
        endDateYear:  Math.abs(dateRange.endDate)
    }

    vm.ok = function () {
        var updatedDateRange = {
            startDate: vm.expandedDateRange.startDateYear,
            endDate: vm.expandedDateRange.endDateYear
        };
        $uibModalInstance.close(updatedDateRange);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}

