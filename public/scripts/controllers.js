'use strict';

var meshweshControllers = angular.module('meshweshControllers', []);

meshweshControllers.controller('HomeCtrl', ['$scope',
    function ($scope) {

    }]);

meshweshControllers.controller('EditThematicCategoriesCtrl', ['$scope', '$routeParams', 'ThematicCategory',
    function($scope, $routeParams, ThematicCategory) {
        $scope.categories = ThematicCategory.list();
    }]);

