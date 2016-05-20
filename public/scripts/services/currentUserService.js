'use strict';

angular
    .module('meshweshServices')
    .factory('CurrentUserService', CurrentUserService);

// CurrentUserService.$inject = ['$resource'];

function CurrentUserService() {
    // Default user is visitor
    var currentUser = {
        role: 'visitor'
    };

    return {
        getUser: function() {
            return currentUser;
        },
        setRole: function(role) {
            currentUser.role = role;
        }
    };
}
