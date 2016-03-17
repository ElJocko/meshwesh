angular
    .module('meshweshFilters')
    .filter('mwDisplayTroopTypes', TroopTypesFilter);

function TroopTypesFilter() {
    return function(input) {
        if (!input) {
            return '';
        }
        else {
            var display = '';
            var firstValue = true;
            input.forEach(function(value) {
                if (firstValue) {
                    display = value;
                    firstValue = false;
                }
                else {
                    display = display + ' or ' + value;
                }
            });
            return display;
        }
    };
}
