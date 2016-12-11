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
//        console.log('new route success: ' + $location.path());
        $window.ga('send', 'pageview', $location.path());
    });

//    $rootScope.$on("$routeChangeStart", function(event, next, current) {
//        console.log('new route start: ' + $location.path());
//    });
});
