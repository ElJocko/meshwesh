angular
    .module('meshweshFilters')
    .filter('mwDisplayYear', YearFilter);

function YearFilter() {
    return function(input) {
        if (input === 0) {
            return 'invalid value';
        }
        else if (input < 0) {
            return input + 'BC';
        }
        else {
            return input + ' AD';
        }
    };
}
