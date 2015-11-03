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
        .when('/thematicCategories/edit', {
            templateUrl:'views/editThematicCategories.html',
            controller:'EditThematicCategoriesCtrl'
        })
        .when('/thematicCategories/:categoryId/edit', {
            templateUrl:'views/editAThematicCategory.html',
            controller:'EditAThematicCategoryCtrl'
        })
        .when('/thematicCategories/new', {
            templateUrl:'views/editAThematicCategory.html',
            controller:'EditAThematicCategoryCtrl'
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
