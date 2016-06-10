'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryExploreController', ThematicCategoryExploreController);

ThematicCategoryExploreController.$inject = ['$routeParams', '$location', 'ThematicCategoryService'];

function ThematicCategoryExploreController($routeParams, $location, ThematicCategoryService) {
    var vm = this;

    var categoryId = $routeParams.categoryId;

    vm.category = ThematicCategoryService.get({ id: categoryId });

    vm.armyLists = ThematicCategoryService.armyLists.list({ id: categoryId });
    console.log(vm.armyLists);

    vm.onClickArmyList = onClickArmyList;
    function onClickArmyList(id) {
        $location.path('/armyList/' + id + '/explore');
    }

}
