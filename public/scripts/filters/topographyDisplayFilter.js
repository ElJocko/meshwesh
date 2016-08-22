angular
    .module('meshweshFilters')
    .filter('mwDisplayTopography', TopographyFilter);

function TopographyFilter() {

    function topographyFilter(input) {
        var output = '';
        if (input.note) {
            output = input.note + ': ';
        }

        var first = true;
        input.values.forEach(function(value) {
            if (first) {
                output = output + value;
                first = false;
            }
            else {
                output = output + ', ' + value;
            }
        });

        return output;
    }

    return topographyFilter;
}
