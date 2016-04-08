'use strict';

angular
    .module('meshweshControllers')
    .controller('RatingEditController', RatingEditController);

function RatingEditController($uibModalInstance, rating, viewHeading) {
    var vm = this;

    vm.rating = {
        rating: rating.rating,
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

