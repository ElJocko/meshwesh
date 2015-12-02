'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryEditController', ThematicCategoryEditController);

ThematicCategoryEditController.$inject = ['$routeParams', '$location', 'ThematicCategoryService'];

function ThematicCategoryEditController($routeParams, $location, ThematicCategoryService) {
    var vm = this;

    var categoryId = $routeParams.categoryId;
    if (categoryId) {
        // Edit an existing thematic category
        vm.category = ThematicCategoryService.get({ id: categoryId });
        vm.submit = updateCategory;
        vm.delete = deleteCategory;
    }
    else {
        // Edit a new thematic category
        vm.category = { name: "" };
        vm.submit = createCategory;
    }

    function updateCategory() {
        ThematicCategoryService.update({ id: categoryId }, vm.category,
            function (category) {
                console.log('Successfully updated ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function createCategory() {
        ThematicCategoryService.create(vm.category,
            function(category) {
                console.log('Successfully created ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function deleteCategory() {
        ThematicCategoryService.destroy({ id: categoryId },
            function(category) {
                console.log('Successfully deleted ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (res) {
                console.log(res.data);
            });
    }
}