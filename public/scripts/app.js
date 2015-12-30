'use strict';

angular.module('meshweshApp', [
    'ngRoute',
    'ui.bootstrap',
    'smart-table',
    'meshweshControllers',
    'meshweshServices',
    'meshweshDirectives'
]);

angular.module('meshweshServices', ['ngResource']);
angular.module('meshweshControllers', []);


angular
    .module('meshweshDirectives', [])
    .directive('contenteditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.render = function(value) {
                elm.html(value);
            };

            elm.bind('keydown', function(event) {
                console.log("keydown " + event.which);
                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                    console.log("esc");
                    ctrl.$setViewValue(elm.html());
                    el.blur();
                    event.preventDefault();
                }
            });
        }
    };
});
