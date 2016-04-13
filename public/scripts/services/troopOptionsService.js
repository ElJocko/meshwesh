'use strict';

angular
    .module('meshweshServices')
    .factory('TroopOptionsImportService', TroopOptionsImportService);

TroopOptionsImportService.$inject = ['$resource'];

function TroopOptionsImportService ($resource) {
    return $resource(
        'api/v1/troopOptionsImport',
        null,
        {
            import: { method: 'POST'}
        }
    );
}
