'use strict';

angular
    .module('meshweshControllers')
    .controller('BattleCardDisplayController', BattleCardDisplayController);

function BattleCardDisplayController($uibModalInstance, battleCardCode) {
    var vm = this;

    vm.viewHeading = 'Battle Card (DRAFT)';

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
