'use strict';

angular
    .module('meshweshControllers')
    .controller('NavbarController', NavbarController);

NavbarController.$inject = ['$location', 'CurrentUserService'];

function NavbarController($location, CurrentUserService) {
    var vm = this;

    vm.user = CurrentUserService.getUser();
}

