'use strict';

angular
    .module('meshweshControllers')
    .controller('SignInController', SignInController);

SignInController.$inject = ['$location', 'SignInService'];

function SignInController($location, SignInService) {
    var vm = this;

    vm.submit = signIn;

    function signIn() {

        var credentials = {
            emailAddress: vm.emailAddress,
            password: vm.password
        };

        SignInService.signIn(credentials,
            function(response) {
                var user = JSON.stringify(response);
                sessionStorage.setItem('meshweshUser', user);
                $location.path('/home');
            },
            function(response) {
                console.error(response.data);
            });
    }
}