'use strict';

angular
    .module('meshweshServices')
    .factory('ArmyListService', ArmyListService)
    .factory('ArmyListImportService', ArmyListImportService)
    .factory('ArmyListEnemiesImportService', ArmyListEnemiesImportService);

ArmyListService.$inject = ['$resource', '$q', '$http'];

function ArmyListService ($resource, $q, $http) {
    var NUMBER_OF_RETRIES = 1;

    var armyListRoutes = $resource(
        'api/v1/armyLists/:id',
        {id: '@id'},
        {
            create: {method: 'POST'},
            list: {method: 'GET', cache: true, isArray: true},
            get: {method: 'GET', cache: true, isArray: false},
            update: {method: 'PUT', isArray: false},
            destroy: {method: 'DELETE', isArray: false}
        }
    );

    armyListRoutes.get = function (params) {
        var counter = 0;
        var request = $q.defer();

        function sendRequest() {
            $http({ method: 'GET', cache: true, url: 'api/v1/armyLists/' + params.id })
                .then(
                    function (body) {
                        request.resolve(body.data);
                    },
                    function () {
                        if (counter < NUMBER_OF_RETRIES) {
                            // Retry
                            ++counter;
                            sendRequest();
                        }
                        else {
                            // Maximum retries reached
                            request.reject('Max retries reached');
                        }
                    });
        }

        sendRequest();

        return request.promise;
    };

    armyListRoutes.associatedArmyLists = {
        list: function (params) {
            var counter = 0;
            var request = $q.defer();

            function sendRequest() {
                $http({ method: 'GET', cache: true, url: 'api/v1/armyLists/' + params.id + '/associatedArmyLists' })
                    .then(
                        function (body) {
                            request.resolve(body.data);
                        },
                        function () {
                            if (counter < NUMBER_OF_RETRIES) {
                                // Retry
                                ++counter;
                                sendRequest();
                            }
                            else {
                                // Maximum retries reached
                                request.reject('Max retries reached');
                            }
                        });
            }

            sendRequest();

            return request.promise;
        }
    };

    armyListRoutes.enemyArmyLists = {
        list: function (params) {
            var counter = 0;
            var request = $q.defer();

            function sendRequest() {
                $http({ method: 'GET', cache: true, url: 'api/v1/armyLists/' + params.id + '/enemyArmyLists' })
                    .then(
                        function (body) {
                            request.resolve(body.data);
                        },
                        function () {
                            if (counter < NUMBER_OF_RETRIES) {
                                // Retry
                                ++counter;
                                sendRequest();
                            }
                            else {
                                // Maximum retries reached
                                request.reject('Max retries reached');
                            }
                        });
            }

            sendRequest();

            return request.promise;
        }
    };

    armyListRoutes.thematicCategories = {
        list: function (params) {
            var counter = 0;
            var request = $q.defer();

            function sendRequest() {
                $http({ method: 'GET', cache: true, url: 'api/v1/armyLists/' + params.id + '/thematicCategories' })
                    .then(
                        function (body) {
                            request.resolve(body.data);
                        },
                        function () {
                            if (counter < NUMBER_OF_RETRIES) {
                                // Retry
                                ++counter;
                                sendRequest();
                            }
                            else {
                                // Maximum retries reached
                                request.reject('Max retries reached');
                            }
                        });
            }

            sendRequest();

            return request.promise;
        }
    };

    armyListRoutes.allyOptions = {
        list: function (params) {
            var counter = 0;
            var request = $q.defer();

            function sendRequest() {
                $http({ method: 'GET', cache: true, url: 'api/v1/armyLists/' + params.id + '/allyOptions' })
                    .then(
                        function (body) {
                            request.resolve(body.data);
                        },
                        function () {
                            if (counter < NUMBER_OF_RETRIES) {
                                // Retry
                                ++counter;
                                sendRequest();
                            }
                            else {
                                // Maximum retries reached
                                request.reject('Max retries reached');
                            }
                        });
            }

            sendRequest();

            return request.promise;
        }
    };

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
