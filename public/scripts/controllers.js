'use strict';

var meshweshControllers = angular.module('meshweshControllers', []);

meshweshControllers.controller('HomeCtrl', ['$scope',
    function ($scope) {

    }]);

meshweshControllers.controller('EditThematicCategoriesCtrl', ['$scope', '$routeParams', '$location', 'ThematicCategory',
    function($scope, $routeParams, $location, ThematicCategory) {
        $scope.categories = ThematicCategory.list();

        $scope.create = function() {
            $location.path('/thematicCategories/new');
        };
    }]);

meshweshControllers.controller('EditAThematicCategoryCtrl', ['$scope', '$routeParams', '$location', 'ThematicCategory',
    function($scope, $routeParams, $location, ThematicCategory) {
        var categoryId = $routeParams.categoryId;
        if (categoryId) {
            $scope.category = ThematicCategory.get({ id: categoryId });
        }
        else {
            $scope.category = { name: "" };
        }

        $scope.submit = function() {
            if (categoryId) {
                ThematicCategory.update({ id: categoryId }, $scope.category,
                    function (category) {
                        console.log('Successfully saved changes to ' + category.name);
                        $location.path('/thematicCategories/edit');
                    }, function (res) {
                        console.log(res.data);
                    });
            }
            else {
                var newCategory = new ThematicCategory($scope.category);
                newCategory.$save().then(function (category) {
                    console.log('Successfully saved changes to ' + category.name);
                    $location.path('/thematicCategories/edit');
                }).catch(function (res) {
                    console.log(res.data);
                });
            }
        };
    }]);

