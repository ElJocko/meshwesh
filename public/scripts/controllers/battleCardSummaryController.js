'use strict';

angular
    .module('meshweshControllers')
    .controller('BattleCardSummaryController', BattleCardSummaryController);

BattleCardSummaryController.$inject = ['$location', '$uibModal', 'BattleCardService'];

function BattleCardSummaryController($location, $uibModal, BattleCardService) {
    var vm = this;

    vm.battleCards = BattleCardService.list();

    vm.showBattleCardRule = showBattleCardRule;
    function showBattleCardRule(battleCardCode) {
        console.log(`will show battle card rule for ${ battleCardCode }`);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: `views/battleCardRules/${ battleCardCode }.html`,
            controller: 'BattleCardDisplayController',
            controllerAs: 'vm',
            resolve: {
                battleCardCode: function () {
                    return battleCardCode;
                }
            }
        });

    }
}
