'use strict';

angular.module('meshweshApp', [
    'ngRoute',
    'ngMessages',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.selection',
    'meshweshControllers',
    'meshweshServices',
    'meshweshDirectives',
    'meshweshFilters'
]);

angular.module('meshweshServices', ['ngResource']);
angular.module('meshweshControllers', ['ui.bootstrap']);
angular.module('meshweshDirectives', []);
angular.module('meshweshFilters', []);

