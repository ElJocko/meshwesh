'use strict';

angular
    .module('meshweshServices')
    .factory('TroopTypeService', TroopTypeService)
    .factory('TroopTypeImportService', TroopTypeImportService);

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

TroopTypeImportService.$inject = ['$resource'];

function TroopTypeImportService ($resource) {
    return $resource(
        'api/v1/troopTypesImport',
        null,
        {
            import: { method: 'POST'}
        }
    );
}
