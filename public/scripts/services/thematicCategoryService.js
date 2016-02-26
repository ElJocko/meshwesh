'use strict';

angular
    .module('meshweshServices')
    .factory('ThematicCategoryService', ThematicCategoryService);

ThematicCategoryService.$inject = ['$resource'];

function ThematicCategoryService ($resource) {
    return $resource(
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
}
