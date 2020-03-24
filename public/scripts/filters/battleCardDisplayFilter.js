angular
    .module('meshweshFilters')
    .filter('mwDisplayBattleCardEntriesList', BattleCardEntriesListFilter)
    .filter('mwDisplayBattleCardMinMax', BattleCardMinMaxFilter);

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

function BattleCardMinMaxFilter() {
    var placeholder = '';

    function BattleCardMinMaxFilter(input) {
        if (!input) {
            return '';
        }

        var display = battleCardsMinMaxFilterFunction(input);
        return display;

        function battleCardsMinMaxFilterFunction(input) {
            var display = '';

            if (input.min === 0) {
                display = '0';
            }
            else if (input.min) {
                display = display + input.min;
            }

            if (input.max) {
                display = display + '-' + input.max;
            }

            return display;
        }
    }

    return BattleCardMinMaxFilter;
}
