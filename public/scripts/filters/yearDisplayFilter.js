angular
    .module('meshweshFilters')
    .filter('mwDisplayYear', YearFilter);

function YearFilter() {
    return function(input) {
        if (input === 0) {
            console.log('invalid value, year may not be 0')
            return '';
        }
        else if (!input) {
            return '';
        }
        else if (input < 0) {
            return (input * -1) + ' BC';
        }
        else {
            return input + ' AD';
        }
    };
}

