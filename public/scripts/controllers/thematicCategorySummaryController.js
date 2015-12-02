'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategorySummaryController', ThematicCategorySummaryController);

ThematicCategorySummaryController.$inject = ['$location', 'ThematicCategoryService'];

function ThematicCategorySummaryController($location, ThematicCategoryService) {
    var vm = this;

    vm.categories = ThematicCategoryService.list();
    vm.create = showCreateThematicCategory;
    vm.edit = showEditThematicCategory;

    function showCreateThematicCategory() {
        $location.path('/thematicCategory/create');
    }

    function showEditThematicCategory(categoryId) {
        $location.path('/thematicCategory/' + categoryId + '/edit');
    }
}