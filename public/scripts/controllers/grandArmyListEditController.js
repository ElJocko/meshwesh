'use strict';

angular
    .module('meshweshControllers')
    .controller('GrandArmyListEditController', GrandArmyListEditController);

GrandArmyListEditController.$inject = ['$routeParams', '$location', 'GrandArmyListService', 'ArmyListService'];

function GrandArmyListEditController($routeParams, $location, GrandArmyListService, ArmyListService) {
    var vm = this;

    var listId = $routeParams.listId;
    if (listId) {
        // Edit an existing grand army list
        GrandArmyListService.get({ id: listId }, function(list) {
            vm.list = list;

            ArmyListService.list(function(lists) {
                vm.armyLists = lists.filter(function(element, index, array) {
                    return (element.grandArmyList == listId);
                })
            });
        });
        vm.submit = updateList;
        vm.delete = deleteList;
    }
    else {
        // Edit a new grand army list
        vm.list = { name: "" };
        vm.submit = createList;
    }

    function updateList() {
        GrandArmyListService.update({ id: listId }, vm.list,
            function(list) {
                console.info('Successfully updated ' + list.name);
                $location.path('/grandArmyList/summary');
            },
            function(response) {
                console.error(response.data);
            });
    }

    function createList() {
        GrandArmyListService.create(vm.list,
            function(list) {
                console.info('Successfully created ' + list.name);
                $location.path('/grandArmyList/summary');
            },
            function(response) {
                console.error(response.data);
            });
    }

    function deleteList() {
        GrandArmyListService.destroy({ id: listId },
            function(list) {
                console.info('Successfully deleted ' + list.name);
                $location.path('/grandArmyList/summary');
            },
            function(response) {
                console.error(response.data);
            });
    }
}