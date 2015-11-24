'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoriesEditController', ThematicCategoriesEditController);

ThematicCategoriesEditController.$inject = ['$routeParams', '$location', 'ThematicCategoriesService'];

function ThematicCategoriesEditController($routeParams, $location, ThematicCategoriesService) {
    var vm = this;

    var categoryId = $routeParams.categoryId;
    if (categoryId) {
        // Edit an existing thematic category
        vm.category = ThematicCategoriesService.get({ id: categoryId });
        vm.submit = updateCategory;
        vm.delete = deleteCategory;
    }
    else {
        // Edit a new thematic category
        vm.category = { name: "" };
        vm.submit = createCategory;
    }

    function updateCategory() {
        ThematicCategoriesService.update({ id: categoryId }, vm.category,
            function (category) {
                console.log('Successfully updated ' + category.name);
                $location.path('/thematicCategories/list');
            }, function (res) {
                console.log(res.data);
            });
    }

    function createCategory() {
        var newCategory = new ThematicCategoriesService(vm.category);
        newCategory.$save().then(function (category) {
            console.log('Successfully created ' + category.name);
            $location.path('/thematicCategories/list');
        }).catch(function (res) {
            console.log(res.data);
        });
    }

    function deleteCategory() {
        ThematicCategoriesService.destroy({ id: categoryId },
            function(category) {
                console.log('Successfully deleted ' + category.name);
                $location.path('/thematicCategories/list');
            }, function (res) {
                console.log(res.data);
            });
    }
}