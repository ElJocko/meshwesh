angular
    .module('meshweshFilters')
    .filter('mwDisplayBattleCardEntriesList', BattleCardEntriesListFilter);

BattleCardEntriesListFilter.$inject = ['BattleCardService'];

function BattleCardEntriesListFilter(BattleCardService) {
    var battleCardData = null;
    var serviceInvoked = false;
    var placeholder = '';

    battleCardsListFilter.reloadData = function() {
        battleCardDataData = null;
        serviceInvoked = false;
    };

    function battleCardsListFilter(input) {
        if (!input) {
            return '';
        }

        if (battleCardData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                BattleCardService.list(function(battleCards) {
                    battleCardData = battleCards;
                });
            }
            return placeholder;
        }
        else {
            var display = battleCardsFilterFunction(input);
            return display;
        }

        function battleCardsFilterFunction(input) {
            var display = '';

            var battleCardType = _.find(battleCardData, { 'permanentCode': input.battleCardCode });
            if (battleCardType) {
                display = battleCardType.displayName;
            }

            return display;
        }
    }

    return battleCardsListFilter;
}