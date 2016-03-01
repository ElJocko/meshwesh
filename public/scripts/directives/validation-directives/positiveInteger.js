angular
    .module('meshweshDirectives')
    .directive('positiveInteger', PositiveIntegerDirective);

// Allow any positive integer. Leading zero not allowed.
var POSITIVE_INTEGER_REGEXP = /^[1-9]\d*$/;

function PositiveIntegerDirective() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.positiveInteger = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (POSITIVE_INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
}
