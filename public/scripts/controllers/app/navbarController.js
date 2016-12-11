'use strict';

angular
    .module('meshweshControllers')
    .controller('NavbarController', NavbarController);

NavbarController.$inject = ['CurrentUserService'];

function NavbarController(CurrentUserService) {
    var vm = this;

    vm.user = CurrentUserService.getUser();
}

