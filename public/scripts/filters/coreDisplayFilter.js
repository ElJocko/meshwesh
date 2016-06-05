angular
    .module('meshweshFilters')
    .filter('mwDisplayCore', BooleanCoreFilter);

function BooleanCoreFilter() {

    function booleanCoreFilter(input) {
        if (input === 'all') {
            return 'X';
        }
        else if (input === 'half') {
            return 'half';
        }
        else {
            return '';
        }
    }

    return booleanCoreFilter;
}
