'use strict';

angular
    .module('meshweshServices')
    .factory('ArmyListService', ArmyListService)
    .factory('ArmyListImportService', ArmyListImportService);

ArmyListService.$inject = ['$resource'];

function ArmyListService ($resource) {
    var armyListRoutes = $resource(
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

    armyListRoutes.associatedArmyLists = $resource(
        'api/v1/armyLists/:id/associatedArmyLists',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }
        }
    );

    return armyListRoutes;
}

ArmyListImportService.$inject = ['$resource'];

function ArmyListImportService ($resource) {
    return $resource(
        'api/v1/armyListsImport',
        null,
        {
            import: { method: 'POST'}
        }
    );
}
