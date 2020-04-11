'use strict';

angular
    .module('meshweshApp')
    .config(router);

router.$inject = ['$routeProvider', '$locationProvider'];

function router($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl:'/views/home.html',
            controller:'HomeController',
            controllerAs: 'vm'
        })
        .when('/signIn', {
            templateUrl:'/views/signIn.html',
            controller:'SignInController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/summary', {
            templateUrl:'/views/thematicCategorySummary.html',
            controller:'ThematicCategorySummaryController',
            controllerAs: 'vm',
            resolve: { mode: function() { return 'explore' } }
        })
        .when('/thematicCategory/summaryEdit', {
            templateUrl:'/views/thematicCategorySummary.html',
            controller:'ThematicCategorySummaryController',
            controllerAs: 'vm',
            resolve: { mode: function() { return 'edit' } }
        })
        .when('/thematicCategory/:categoryId/explore', {
            templateUrl:'/views/thematicCategoryExplore.html',
            controller:'ThematicCategoryExploreController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/:categoryId/edit', {
            templateUrl:'/views/thematicCategoryEdit.html',
            controller:'ThematicCategoryEditController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/create', {
            templateUrl:'/views/thematicCategoryEdit.html',
            controller:'ThematicCategoryEditController',
            controllerAs: 'vm'
        })
        .when('/armyList/summary', {
            templateUrl:'/views/armyListSummary.html',
            controller:'ArmyListSummaryController',
            controllerAs: 'vm',
            reloadOnSearch: false,
            resolve: { mode: function() { return 'explore' } }
        })
        .when('/armyList/summaryEdit', {
            templateUrl:'/views/armyListSummary.html',
            controller:'ArmyListSummaryController',
            controllerAs: 'vm',
            reloadOnSearch: false,
            resolve: { mode: function() { return 'edit' } }
        })
        .when('/armyList/:listId/edit', {
            templateUrl:'/views/armyListEdit.html',
            controller:'ArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/armyList/:listId/explore', {
            templateUrl:'/views/armyListExplore.html',
            controller:'ArmyListExploreController',
            controllerAs: 'vm'
        })
        .when('/armyList/create', {
            templateUrl:'/views/armyListEdit.html',
            controller:'ArmyListEditController',
            controllerAs: 'vm'
        })
        .when('/troopType/summary', {
            templateUrl:'/views/troopTypeSummary.html',
            controller:'TroopTypeSummaryController',
            controllerAs: 'vm'
        })
        .when('/troopType/description', {
            templateUrl:'/views/troopTypeDescription.html',
            controller:'TroopTypeDescriptionController',
            controllerAs: 'vm'
        })
        .when('/troopType/:troopTypeId/edit', {
            templateUrl:'/views/troopTypeEdit.html',
            controller:'TroopTypeEditController',
            controllerAs: 'vm'
        })
        .when('/troopType/create', {
            templateUrl:'/views/troopTypeEdit.html',
            controller:'TroopTypeEditController',
            controllerAs: 'vm'
        })
        .when('/report/armyListMinMax', {
            templateUrl:'/views/armyListMinMaxReport.html',
            controller:'ArmyListMinMaxReportController',
            controllerAs: 'vm'
        })
        .when('/thematicCategory/import', {
            templateUrl:'/views/thematicCategoryImport.html',
            controller:'ThematicCategoryImportController',
            controllerAs: 'vm'
        })
        .when('/armyList/import', {
            templateUrl:'/views/armyListImport.html',
            controller:'ArmyListImportController',
            controllerAs: 'vm'
        })
        .when('/troopOptions/import', {
            templateUrl:'/views/troopOptionsImport.html',
            controller:'TroopOptionsImportController',
            controllerAs: 'vm'
        })
        .when('/armyListEnemies/import', {
            templateUrl:'/views/enemiesImport.html',
            controller:'EnemiesImportController',
            controllerAs: 'vm'
        })
        .when('/troopType/import', {
            templateUrl:'/views/troopTypeImport.html',
            controller:'TroopTypeImportController',
            controllerAs: 'vm'
        })
        .when('/battleCard/import', {
            templateUrl:'/views/battleCardImport.html',
            controller:'BattleCardImportController',
            controllerAs: 'vm'
        })
        .when('/battleCard/summary', {
            templateUrl:'/views/battleCardSummary.html',
            controller:'BattleCardSummaryController',
            controllerAs: 'vm'
        })
        .when('/export', {
            templateUrl:'/export.html',
            controller:'ExportCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });

    $locationProvider.html5Mode({ enabled: true, requireBase: true, rewriteLinks: true });
}

