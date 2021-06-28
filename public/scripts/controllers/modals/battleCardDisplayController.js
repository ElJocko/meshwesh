'use strict';

angular
    .module('meshweshControllers')
    .controller('BattleCardDisplayController', BattleCardDisplayController);

BattleCardDisplayController.$inject = ['$uibModalInstance', '$sce', 'battleCard'];

function BattleCardDisplayController($uibModalInstance, $sce, battleCard) {
    var vm = this;

    vm.viewHeading = 'Battle Card (DRAFT)';
    vm.title = battleCard.displayName;
    vm.battleCardText = $sce.trustAsHtml(battleCard.htmlText);

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
