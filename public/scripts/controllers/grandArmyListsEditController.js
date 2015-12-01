'use strict';

angular
    .module('meshweshControllers')
    .controller('GrandArmyListsEditController', GrandArmyListsEditController);

GrandArmyListsEditController.$inject = ['$routeParams', '$location', 'GrandArmyListsService'];

function GrandArmyListsEditController($routeParams, $location, GrandArmyListsService) {
    var vm = this;

    var listId = $routeParams.listId;
    if (listId) {
        // Edit an existing grand army list
        vm.list = GrandArmyListsService.get({ id: listId });
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new grand army list
        vm.list = { name: "" };
        vm.submit = createList;
    }

    function updateList() {
        GrandArmyListsService.update({ id: listId }, vm.list,
            function (list) {
                console.log('Successfully updated ' + list.name);
                $location.path('/grandArmyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function createList() {
        GrandArmyListsService.create(vm.list,
            function(list) {
                console.log('Successfully created ' + list.name);
                $location.path('/grandArmyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }

    function deleteList() {
        GrandArmyListsService.destroy({ id: listId },
            function(list) {
                console.log('Successfully deleted ' + list.name);
                $location.path('/grandArmyLists/list');
            },
            function (res) {
                console.log(res.data);
            });
    }
}