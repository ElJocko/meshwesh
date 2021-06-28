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
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: `views/modals/battleCardDisplay.html`,
            controller: 'BattleCardDisplayController',
            controllerAs: 'vm',
            resolve: {
                battleCard: function () {
                    var battleCard = vm.battleCards.find(card => card.permanentCode === battleCardCode);
                    return battleCard;
                }
            }
        });
    }
}
