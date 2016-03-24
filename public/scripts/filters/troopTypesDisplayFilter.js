angular
    .module('meshweshFilters')
    .filter('mwDisplayTroopTypes', TroopTypesFilter)
    .filter('mwDisplayTroopTypesList', TroopTypesListFilter);

TroopTypesFilter.$inject = ['TroopTypeService'];
TroopTypesListFilter.$inject = ['TroopTypeService'];

function TroopTypesFilter(TroopTypeService) {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    troopTypesFilter.$stateful = true;
    function troopTypesFilter(input) {
        if (!input) {
            return '';
        }

        function troopTypeAsDisplayName(input) {
            var display = '';

            var troopType = _.find(troopTypesData, { 'permanentCode': input });
            if (troopType) {
                display = troopType.displayName;
            }

            return display;
        }

        if (troopTypesData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                TroopTypeService.list(function(troopTypes) {
                    troopTypesData = troopTypes;
                });
            }
            return placeholder;
        }
        else {
            var display = troopTypeAsDisplayName(input);
            return display;
        }
    }

    return troopTypesFilter;
}

function TroopTypesListFilter(TroopTypeService) {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    return function(input) {
        if (!input) {
            return '';
        }

        function troopTypesFilterFunction(input) {
            var display = '';
            var firstValue = true;

            input.forEach(function(value) {
                var troopType = _.find(troopTypesData, { 'permanentCode': value });
                if (troopType) {
                    if (firstValue) {
                        display = troopType.displayName;
                        firstValue = false;
                    }
                    else {
                        display = display + ' or ' + troopType.displayName;
                    }
                }
            });

            return display;
        }

        if (troopTypesData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                TroopTypeService.list(function(troopTypes) {
                    troopTypesData = troopTypes;
                });
            }
            return placeholder;
        }
        else {
            var display = troopTypesFilterFunction(input);
            return display;
        }
    };
}

