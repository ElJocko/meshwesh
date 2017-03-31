'use strict';

angular
    .module('meshweshServices')
    .factory('AllyArmyListService', AllyArmyListService)
    .factory('AllyArmyListImportService', AllyArmyListImportService);

AllyArmyListService.$inject = ['$resource'];

function AllyArmyListService ($resource) {
    var allyArmyListRoutes = $resource(
        'api/v1/allyArmyLists/:id',
        { id: '@id' },
        {
            create: { method: 'POST'},
            list: { method: 'GET', cache: true, isArray: true },
            get: { method: 'GET', cache: true, isArray: false },
            update: { method: 'PUT', isArray: false },
            destroy: { method: 'DELETE', isArray: false }
        }
    );

    return allyArmyListRoutes;
}

AllyArmyListImportService.$inject = ['$resource'];

function AllyArmyListImportService ($resource) {
    return $resource(
        'api/v1/allyArmyListsImport',
        null,
        {
            import: { method: 'POST' }
        }
    );
}

