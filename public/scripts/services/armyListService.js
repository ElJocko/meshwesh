'use strict';

angular
    .module('meshweshServices')
    .factory('ArmyListService', ArmyListService);

ArmyListService.$inject = ['$resource'];

function ArmyListService ($resource) {
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
