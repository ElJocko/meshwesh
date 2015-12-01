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
        .when('/grandArmyLists/list', {
            templateUrl:'views/grandArmyListsList.html',
            controller:'GrandArmyListsListController',
            controllerAs: 'vm'
        })
        .when('/grandArmyLists/:listId/edit', {
            templateUrl:'views/grandArmyListsEdit.html',
            controller:'GrandArmyListsEditController',
            controllerAs: 'vm'
        })
        .when('/grandArmyLists/create', {
            templateUrl:'views/grandArmyListsEdit.html',
            controller:'GrandArmyListsEditController',
            controllerAs: 'vm'
        })
        .when('/armyLists/list', {
            templateUrl:'views/armyListsList.html',
            controller:'ArmyListsListController',
            controllerAs: 'vm'
        })
        .when('/armyLists/:listId/edit', {
            templateUrl:'views/armyListsEdit.html',
            controller:'ArmyListsEditController',
            controllerAs: 'vm'
        })
        .when('/armyLists/create', {
            templateUrl:'views/armyListsEdit.html',
            controller:'ArmyListsEditController',
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
