'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoriesListController', ThematicCategoriesListController);

ThematicCategoriesListController.$inject = ['$location', 'ThematicCategoriesService'];

function ThematicCategoriesListController($location, ThematicCategoriesService) {
    var vm = this;
    vm.categories = ThematicCategoriesService.list();

    vm.create = function() {
        $location.path('/thematicCategories/new');
    };
}