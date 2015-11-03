'use strict';

var meshweshApp = angular.module('meshweshApp', [
    'ngRoute',
    'ui.bootstrap',
    'meshweshControllers',
    'meshweshServices'
]);

meshweshApp.config(['$routeProvider',
function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl:'views/home.html',
            controller:'HomeCtrl'
        })
        .when('/edit/thematicCategories', {
            templateUrl:'views/editThematicCategories.html',
            controller:'EditThematicCategoriesCtrl'
        })
        .when('/report', {
            templateUrl:'report.html',
            controller:'ReportCtrl'
        })
        .when('/export', {
            templateUrl:'export.html',
            controller:'ExportCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });

}]);
