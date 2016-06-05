angular
    .module('meshweshFilters')
    .filter('mwDisplayBooleanCheck', BooleanCheckFilter);

function BooleanCheckFilter() {

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
