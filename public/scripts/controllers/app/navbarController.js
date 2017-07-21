'use strict';

angular
    .module('meshweshControllers')
    .controller('NavbarController', NavbarController);

NavbarController.$inject = ['$location', 'CurrentUserService', 'ArmyListService'];

function NavbarController($location, CurrentUserService, ArmyListService) {
    var vm = this;

    vm.user = CurrentUserService.getUser();

    vm.armyLists = [];
    vm.armyListResultsList = [];
    vm.showResults = false;
    vm.moreResults = false;

    ArmyListService.listSummary(function(armyLists) {
        vm.armyLists = armyLists;
    });

    vm.searchChanged = searchChanged;
    function searchChanged() {
        vm.moreResults = false;

        if (vm.searchName.length === 0) {
            vm.armyListResultsList = [];
            vm.showResults = false;
        }
        else {
            var searchNameUpper = vm.searchName.toUpperCase();
            vm.armyListResultsList = vm.armyLists.filter(function (armyList) {
                return armyList.name.toUpperCase().includes(searchNameUpper);
            });

            // Limit to the first 20 results
            if (vm.armyListResultsList.length > 20) {
                vm.armyListResultsList = vm.armyListResultsList.slice(0, 21);
                vm.moreResults = true;
            }

            vm.showResults = true;
        }
    }

    vm.onClickArmyList = onClickArmyList;
    function onClickArmyList(id) {
        // Clear the search
        vm.searchName = '';
        vm.armyListResultsList = [];
        vm.showResults = false;
        vm.moreResults = false;

        // Go to the army list page
        $location.path('/armyList/' + id + '/explore');
    }
}

