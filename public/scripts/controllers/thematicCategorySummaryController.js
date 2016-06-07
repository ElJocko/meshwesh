'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategorySummaryController', ThematicCategorySummaryController);

ThematicCategorySummaryController.$inject = ['$location', 'ThematicCategoryService', 'mode'];

function ThematicCategorySummaryController($location, ThematicCategoryService, mode) {
    var vm = this;

    if (mode === 'edit') {
        vm.create = showCreateThematicCategory;
        vm.edit = showEditThematicCategory;
    }
    else if (mode === 'explore') {
        vm.create = null;
        vm.edit = showExploreThematicCategory;
    }

    vm.categories = ThematicCategoryService.list();

    function showCreateThematicCategory() {
        $location.path('/thematicCategory/create');
    }

    function showEditThematicCategory(categoryId) {
        $location.path('/thematicCategory/' + categoryId + '/edit');
    }

    function showExploreThematicCategory(categoryId) {
        $location.path('/thematicCategory/' + categoryId + '/explore');
    }
}