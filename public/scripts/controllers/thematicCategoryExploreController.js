'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryExploreController', ThematicCategoryExploreController);

ThematicCategoryExploreController.$inject = ['$routeParams', '$location', 'ThematicCategoryService'];

function ThematicCategoryExploreController($routeParams, $location, ThematicCategoryService) {
    var vm = this;

    var categoryId = $routeParams.categoryId;

    vm.category = ThematicCategoryService.get({ id: categoryId });

}
