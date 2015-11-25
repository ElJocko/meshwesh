'use strict';

angular
    .module('meshweshApp')
    .config(router);

router.$inject = ['$routeProvider'];

function router($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl:'views/home.html',
            controller:'HomeController'
        })
        .when('/thematicCategories/list', {
            templateUrl:'views/thematicCategoriesList.html',
            controller:'ThematicCategoriesListController',
            controllerAs: 'vm'
        })
        .when('/thematicCategories/:categoryId/edit', {
            templateUrl:'views/thematicCategoriesEdit.html',
            controller:'ThematicCategoriesEditController',
            controllerAs: 'vm'
        })
        .when('/thematicCategories/create', {
            templateUrl:'views/thematicCategoriesEdit.html',
            controller:'ThematicCategoriesEditController',
            controllerAs: 'vm'
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
}
