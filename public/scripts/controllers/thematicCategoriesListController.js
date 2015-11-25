'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoriesListController', ThematicCategoriesListController);

ThematicCategoriesListController.$inject = ['$location', 'ThematicCategoriesService'];

function ThematicCategoriesListController($location, ThematicCategoriesService) {
    var vm = this;

    vm.categories = ThematicCategoriesService.list();
    vm.create = showCreateThematicCategory;
    vm.edit = showEditThematicCategory;

    function showCreateThematicCategory() {
        $location.path('/thematicCategories/create');
    }

    function showEditThematicCategory(categoryId) {
        $location.path('/thematicCategories/' + categoryId + '/edit');
    }
}