'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoriesListController', ['$location', 'ThematicCategoriesService', thematicCategoriesListController]);

function thematicCategoriesListController($location, ThematicCategoriesService) {
    var vm = this;
    vm.categories = ThematicCategoriesService.list();

    vm.create = function() {
        $location.path('/thematicCategories/new');
    };
}