'use strict';

angular
    .module('meshweshServices')
    .factory('TokenInterceptor', TokenInterceptor)
    .config(InstallTokenInterceptor);

TokenInterceptor.$inject = ['CurrentUserService'];

function TokenInterceptor(CurrentUserService) {
    return {
        request: function(config) {
            var token = CurrentUserService.getUser().token;
            if (token) {
                config.headers['PRIVATE-TOKEN'] = token;
            }

            return config;
        }
    };
}

InstallTokenInterceptor.$inject = ['$httpProvider'];

function InstallTokenInterceptor($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
}

