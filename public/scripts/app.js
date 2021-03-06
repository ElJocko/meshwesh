'use strict';

var app = angular.module(
    'meshweshApp',
    [
        'ngAnimate',
        'ngRoute',
        'ngMessages',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.selection',
        'angular-loading-bar',
        'meshweshControllers',
        'meshweshServices',
        'meshweshDirectives',
        'meshweshFilters'
    ]
);

angular.module('meshweshServices', ['ngResource']);
angular.module('meshweshControllers', ['ui.bootstrap']);
angular.module('meshweshDirectives', []);
angular.module('meshweshFilters', []);

angular.module('angular-loading-bar').config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#progress-bar';
}]);

app.run(function($rootScope, $window, $location) {
    $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
        // Scroll to the top of the window
        window.scrollTo(0, 0);

        // Send analytics info
        $window.ga('send', 'pageview', $location.path());
    });
});

require('./polyfill');
require('./controllers');
require('./directives');
require('./filters');
require('./routes');
require('./services');
