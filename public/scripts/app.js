'use strict';

angular.module('meshweshApp', [
    'ngRoute',
    'ui.bootstrap',
    'smart-table',
    'meshweshControllers',
    'meshweshServices',
    'meshweshDirectives',
    'meshweshFilters'
]);

angular.module('meshweshServices', ['ngResource']);
angular.module('meshweshControllers', []);
angular.module('meshweshDirectives', []);
angular.module('meshweshFilters', []);

