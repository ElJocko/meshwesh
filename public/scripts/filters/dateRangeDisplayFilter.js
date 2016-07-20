angular
    .module('meshweshFilters')
    .filter('mwDisplayDateRange', DateRangeFilter);

function DateRangeFilter() {
    return function(input) {
        var startYear = '';
        var startEra = '';
        var endYear = '';

        if (!input) {
            return '';
        }

        if (!input.startDate || input.startDate === 0) {
            return '';
        }
        else if (input.startDate < 0) {
            startYear = input.startDate * -1;
            startEra = 'BC';
        }
        else {
            startYear = input.startDate;
            startEra = 'AD';
        }

        if (!input.endDate || input.endDate === 0) {
            return startYear + ' ' + startEra;
        }
        else if (input.endDate === input.startDate) {
            return startYear + ' ' + startEra;
        }
        else if (input.endDate < 0) {
            endYear = input.endDate * -1;

            return startYear + ' to ' + endYear + ' BC';
        }
        else {
            endYear = input.endDate;
            if (input.startDate < 0) {
                return startYear + ' BC to ' + endYear + ' AD';
            }
            else {
                return startYear + ' to ' + endYear + ' AD';
            }
        }
    };
}

