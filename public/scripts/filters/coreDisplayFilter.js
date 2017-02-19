angular
    .module('meshweshFilters')
    .filter('mwDisplayCore', BooleanCoreFilter);

function BooleanCoreFilter() {

    function booleanCoreFilter(input) {
        if (input === 'all') {
            return 'all';
        }
        else if (input === 'half') {
            return 'half';
        }
        else {
            return '\u2013'; // en dash
        }
    }

    return booleanCoreFilter;
}
