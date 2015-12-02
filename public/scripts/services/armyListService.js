'use strict';

angular
    .module('meshweshServices')
    .factory('ArmyListService', ['$resource', armyListService]);

function armyListService ($resource) {
    return $resource(
        'api/v1/armyLists/:id',
        { id: '@id' },
        {
            create: { method: 'POST'},
            list: { method: 'GET', isArray: true },
            get: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false },
            destroy: { method: 'DELETE', isArray: false }
        }
    );
}