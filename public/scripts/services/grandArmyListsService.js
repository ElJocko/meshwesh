'use strict';

angular
    .module('meshweshServices')
    .factory('GrandArmyListsService', ['$resource', grandArmyListsService]);

function grandArmyListsService ($resource) {
    return $resource(
        'api/v1/grandArmyLists/:id',
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
