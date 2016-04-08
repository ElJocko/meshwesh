'use strict';

angular
    .module('meshweshControllers')
    .controller('RatingEditController', RatingEditController);

function RatingEditController($uibModalInstance, rating, viewHeading) {
    var vm = this;

    vm.rating = {
        value: rating.value,
        note: rating.note
    };
    vm.viewHeading = viewHeading;

    vm.ok = function () {
        $uibModalInstance.close(vm.rating);
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

