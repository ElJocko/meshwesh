'use strict';

angular
    .module('meshweshControllers')
    .controller('ImageDisplayController', ImageDisplayController);

function ImageDisplayController($uibModalInstance, troopType) {
    var vm = this;

    vm.viewHeading = troopType.displayName;
    vm.imageSource = troopType.imageSource;

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
