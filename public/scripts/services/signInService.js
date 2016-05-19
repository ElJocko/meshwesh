'use strict';

angular
    .module('meshweshServices')
    .factory('SignInService', SignInService);

SignInService.$inject = ['$resource'];

function SignInService ($resource) {
    return $resource(
        'api/v1/userCredentials',
        {  },
        {
            signIn: { method: 'POST'}
        }
    );
}
