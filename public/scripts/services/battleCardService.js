'use strict';

angular
    .module('meshweshServices')
    .factory('BattleCardService', BattleCardService)
    .factory('BattleCardImportService', BattleCardImportService);

BattleCardService.$inject = ['$resource'];

function BattleCardService ($resource) {
    return $resource(
        'api/v1/battleCards/:id',
        { id: '@id' },
        {
            create: { method: 'POST'},
            list: { method: 'GET', cache: true, isArray: true },
            get: { method: 'GET', cache: true, isArray: false },
            update: { method: 'PUT', isArray: false },
            destroy: { method: 'DELETE', isArray: false }
        }
    );
}

BattleCardImportService.$inject = ['$resource'];

function BattleCardImportService ($resource) {
    return $resource(
        'api/v1/battleCardsImport',
        null,
        {
            import: { method: 'POST'}
        }
    );
}
