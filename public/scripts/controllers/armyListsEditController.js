'use strict';

angular
    .module('meshweshControllers')
    .controller('ArmyListsEditController', ArmyListsEditController);

ArmyListsEditController.$inject = ['$routeParams', '$location', 'ArmyListsService'];

function ArmyListsEditController($routeParams, $location, ArmyListsService) {
    var vm = this;

    var listId = $routeParams.listId;
    if (listId) {
        // Edit an existing army list
        vm.list = ArmyListsService.get({ id: listId });
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new army list
        vm.list = { name: "" };
        vm.submit = createList;
    }

    function updateList() {
        ArmyListsService.update({ id: listId }, vm.list,
            function (list) {
                console.log('Successfully updated ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function createList() {
        ArmyListsService.create(vm.list,
            function(list) {
                console.log('Successfully created ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function deleteList() {
        ArmyListsService.destroy({ id: listId },
            function(list) {
                console.log('Successfully deleted ' + list.name);
                $location.path('/armyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }
}