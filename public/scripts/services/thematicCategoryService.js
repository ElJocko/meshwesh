'use strict';

angular
    .module('meshweshServices')
    .factory('ThematicCategoryService', ThematicCategoryService)
    .factory('ThematicCategoryImportService', ThematicCategoryImportService);

ThematicCategoryService.$inject = ['$resource'];

function ThematicCategoryService ($resource) {
    var thematicCategoryRoutes = $resource(
        'api/v1/thematicCategories/:id',
        { id: '@id' },
        {
            create: { method: 'POST'},
            list: { method: 'GET', isArray: true },
            get: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false },
            destroy: { method: 'DELETE', isArray: false }
        }
    );

    thematicCategoryRoutes.armyLists = $resource(
        'api/v1/thematicCategories/:id/armyLists',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }
        }
    );

    return thematicCategoryRoutes;
}


ThematicCategoryImportService.$inject = ['$resource'];

function ThematicCategoryImportService ($resource) {
    return $resource(
        'api/v1/thematicCategoriesImport',
        null,
        {
            import: { method: 'POST'}
        }
    );
}
