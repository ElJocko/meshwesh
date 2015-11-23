'use strict';

angular
    .module('meshweshApp')
    .config(['$routeProvider',
        function($routeProvider) {
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
                .when('/thematicCategories/new', {
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

        }]);
