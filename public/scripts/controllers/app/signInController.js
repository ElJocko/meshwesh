'use strict';

angular
    .module('meshweshControllers')
    .controller('SignInController', SignInController);

SignInController.$inject = ['$location', 'SignInService', 'CurrentUserService'];

function SignInController($location, SignInService, CurrentUserService) {
    var vm = this;

    vm.submit = signIn;

    function signIn() {

        var credentials = {
            emailAddress: vm.emailAddress,
            password: vm.password
        };

        SignInService.signIn(credentials,
            function(response) {
                var user = response;
                CurrentUserService.setRole(user.role);

                $location.path('/home');
            },
            function(response) {
                console.error(response.data);
            });
    }
}