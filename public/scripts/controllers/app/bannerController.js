'use strict';

angular
    .module('meshweshControllers')
    .controller('BannerController', BannerController);

BannerController.$inject = ['$location', 'CurrentUserService'];

function BannerController($location, CurrentUserService) {
    var vm = this;

    vm.user = CurrentUserService.getUser();

    vm.toggleSignIn = toggleSignIn;
    function toggleSignIn() {
        if (vm.user.token) {
            CurrentUserService.setRole(null);
            CurrentUserService.setToken(null);
            $location.path('/home');
        }
        else {
            $location.path('/signIn');
        }
    }
}

