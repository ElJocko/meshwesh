'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryExploreController', ThematicCategoryExploreController);

ThematicCategoryExploreController.$inject = ['$route', '$location', 'ThematicCategoryService'];

function ThematicCategoryExploreController($route, $location, ThematicCategoryService) {
    var vm = this;

    var categoryId = $route.current.params.categoryId;

    vm.category = ThematicCategoryService.get({ id: categoryId });

    vm.armyLists = ThematicCategoryService.armyLists.list({ id: categoryId });
    console.log(vm.armyLists);

    vm.onClickArmyList = onClickArmyList;
    function onClickArmyList(id) {
        $location.path('/armyList/' + id + '/explore');
    }

}
