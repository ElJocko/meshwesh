angular
    .module('meshweshDirectives')
    .directive('greaterThan', GreaterThanDirective);

// Allow any positive integer. Leading zero not allowed.
var POSITIVE_INTEGER_REGEXP = /^[1-9]\d*$/;

function GreaterThanDirective() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=greaterThan"
        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.greaterThan = function (modelValue) {
                if (POSITIVE_INTEGER_REGEXP.test(modelValue) && POSITIVE_INTEGER_REGEXP.test(scope.otherModelValue)) {
                    // Both are integers. Compare them.
                    return modelValue > scope.otherModelValue;
                }
                else {
                    // Treat the values as not invalid.
                    return true;
                }
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
}
