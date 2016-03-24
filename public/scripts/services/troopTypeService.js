'use strict';

angular
    .module('meshweshServices')
    .factory('TroopTypeService', TroopTypeService);

TroopTypeService.$inject = ['$resource'];

function TroopTypeService ($resource) {
    return $resource(
        'api/v1/troopTypes/:id',
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
