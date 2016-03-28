angular
    .module('meshweshFilters')
    .filter('mwDisplayBooleanCheck', BooleanCheckFilter);

function BooleanCheckFilter() {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    function booleanCheckFilter(input) {
        if (input) {
            return 'X';
        }
        else {
            return '';
        }
    }

    return booleanCheckFilter;
}

