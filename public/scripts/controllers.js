'use strict';

var meshweshControllers = angular.module('meshweshControllers', []);

meshweshControllers.controller('sidebarCtrl', ['$scope', '$http',
    function ($scope, $http) {

    }]);

meshweshControllers.controller('mainViewCtrl', ['$scope', '$routeParams', 'ThematicCategory',
    function($scope, $routeParams, ThematicCategory) {
        $scope.categories = ThematicCategory.list();
    }]);