'use strict';

var meshweshServices = angular.module('meshweshServices', ['ngResource']);

meshweshServices.factory('ThematicCategory', ['$resource',
        function ($resource) {
            return $resource('api/v1/thematicCategories/:id', {
                    id: '@id'
                },
                {
                    create: { method: 'POST'},
                    list: { method: 'GET', isArray: true },
                    get: { method: 'GET', isArray: false },
                    update: { method: 'PUT', isArray: false },
                    destroy: { method: 'DELETE', isArray: false }
                }
            );
        }
]);
