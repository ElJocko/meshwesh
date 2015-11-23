'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoriesEditController', ['$routeParams', '$location', 'ThematicCategoriesService', thematicCategoriesEditController]);

function thematicCategoriesEditController($routeParams, $location, ThematicCategoriesService) {
    var vm = this;

    var categoryId = $routeParams.categoryId;
    if (categoryId) {
        vm.category = ThematicCategoriesService.get({ id: categoryId });
    }
    else {
        vm.category = { name: "" };
    }

    vm.submit = function() {
        if (categoryId) {
            ThematicCategoriesService.update({ id: categoryId }, vm.category,
                function (category) {
                    console.log('Successfully saved changes to ' + category.name);
                    $location.path('/thematicCategories/list');
                }, function (res) {
                    console.log(res.data);
                });
        }
        else {
            var newCategory = new ThematicCategoriesService(vm.category);
            newCategory.$save().then(function (category) {
                console.log('Successfully saved changes to ' + category.name);
                $location.path('/thematicCategories/list');
            }).catch(function (res) {
                console.log(res.data);
            });
        }
    };
}