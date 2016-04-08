'use strict';

var app = angular.module(
    'meshweshApp',
    [
        'ngAnimate',
        'ngRoute',
        'ngMessages',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.selection',
        'angular-loading-bar',
        'meshweshControllers',
        'meshweshServices',
        'meshweshDirectives',
        'meshweshFilters'
    ]
);

angular.module('meshweshServices', ['ngResource']);
angular.module('meshweshControllers', ['ui.bootstrap']);
angular.module('meshweshDirectives', []);
angular.module('meshweshFilters', []);

