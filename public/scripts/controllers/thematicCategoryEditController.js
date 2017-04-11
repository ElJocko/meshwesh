'use strict';

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryEditController', ThematicCategoryEditController);

ThematicCategoryEditController.$inject = ['$route', '$location', 'ThematicCategoryService'];

function ThematicCategoryEditController($route, $location, ThematicCategoryService) {
    var vm = this;

    var categoryId = $route.current.params.categoryId;
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
                console.info('Successfully updated ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function createCategory() {
        ThematicCategoryService.create(vm.category,
            function (category) {
                console.info('Successfully created ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }

    function deleteCategory() {
        ThematicCategoryService.destroy({ id: categoryId },
            function (category) {
                console.info('Successfully deleted ' + category.name);
                $location.path('/thematicCategory/summary');
            },
            function (response) {
                console.error(response.data);
            });
    }
}