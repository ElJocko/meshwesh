angular
    .module('meshweshDirectives')
    .directive('nonnegativeInteger', NonnegativeIntegerDirective);

// Allow any positive integer. Leading zero not allowed.
var NONNEGATIVE_INTEGER_REGEXP = /^[0-9]\d*$/;

function NonnegativeIntegerDirective() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.nonnegativeInteger = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (NONNEGATIVE_INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
}
