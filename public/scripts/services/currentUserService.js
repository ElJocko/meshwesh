'use strict';

angular
    .module('meshweshServices')
    .factory('CurrentUserService', CurrentUserService);

// CurrentUserService.$inject = ['$resource'];

function CurrentUserService() {
    // Default user is visitor
    var currentUser = {
        role: 'visitor',
        token: null
    };

    return {
        getUser: function() {
            return currentUser;
        },
        setRole: function(role) {
            currentUser.role = role;
        },
        setToken: function(token) {
            currentUser.token  = token;
        }
    };
}
