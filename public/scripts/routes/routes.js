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
        .when('/thematicCategory/summary', {
            templateUrl:'views/thematicCategorySummary.html',
            controller:'ThematicCategorySummaryController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/:categoryId/edit', {
            templateUrl:'views/thematicCategoryEdit.html',
            controller:'ThematicCategoryEditController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/create', {
            templateUrl:'views/thematicCategoryEdit.html',
            controller:'ThematicCategoryEditController',
            controllerAs: 'vm'
        })
        .when('/grandArmyList/summary', {
            templateUrl:'views/grandArmyListSummary.html',
            controller:'GrandArmyListSummaryController',
            controllerAs: 'vm'
        })
        .when('/grandArmyList/:listId/edit', {
            templateUrl:'views/grandArmyListEdit.html',
            controller:'GrandArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/grandArmyList/create', {
            templateUrl:'views/grandArmyListEdit.html',
            controller:'GrandArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/armyList/summary', {
            templateUrl:'views/armyListSummary.html',
            controller:'ArmyListSummaryController',
            controllerAs: 'vm'
        })
        .when('/armyList/:listId/edit', {
            templateUrl:'views/armyListEdit.html',
            controller:'ArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/armyList/create', {
            templateUrl:'views/armyListEdit.html',
            controller:'ArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/troopType/summary', {
            templateUrl:'views/troopTypeSummary.html',
            controller:'TroopTypeSummaryController',
            controllerAs: 'vm'
        })
        .when('/troopType/:troopTypeId/edit', {
            templateUrl:'views/troopTypeEdit.html',
            controller:'TroopTypeEditController',
            controllerAs: 'vm'
        })
        .when('/troopType/create', {
            templateUrl:'views/troopTypeEdit.html',
            controller:'TroopTypeEditController',
            controllerAs: 'vm'
        })
        .when('/report', {
            templateUrl:'report.html',
            controller:'ReportCtrl'
        })
        .when('/troopType/import', {
            templateUrl:'views/troopTypeImport.html',
            controller:'TroopTypeImportController',
            controllerAs: 'vm'
        })
        .when('/export', {
            templateUrl:'export.html',
            controller:'ExportCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}
