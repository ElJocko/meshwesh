'use strict';

angular
    .module('meshweshServices')
    .factory('ArmyListService', ArmyListService)
    .factory('ArmyListImportService', ArmyListImportService)
    .factory('ArmyListEnemiesImportService', ArmyListEnemiesImportService);

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

    armyListRoutes.enemyArmyLists = $resource(
        'api/v1/armyLists/:id/enemyArmyLists',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }
        }
    );

    armyListRoutes.thematicCategories = $resource(
        'api/v1/armyLists/:id/thematicCategories',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }
        }
    );

    armyListRoutes.allyOptions = $resource(
        'api/v1/armyLists/:id/allyOptions',
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
            import: { method: 'POST' }
        }
    );
}

ArmyListEnemiesImportService.$inject = ['$resource'];

function ArmyListEnemiesImportService ($resource) {
    return $resource(
        'api/v1/enemyXrefImport',
        null,
        {
            import: { method: 'POST' }
        }
    );
}
