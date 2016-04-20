'use strict';

angular
    .module('meshweshServices')
    .factory('BookService', BookService);

BookService.$inject = ['$resource'];

function BookService ($resource) {
    return $resource(
        'api/v1/books/:id',
        { id: '@id' },
        {
            list: { method: 'GET', isArray: true }
        }
    );
}

