'use strict';

angular
    .module('meshweshControllers')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$location', 'BookService'];

function HomeController($location, BookService) {
    var vm = this;

    BookService.list(function(books) {
        if (books.length > 0) {
            vm.book = books[0];
        }
    });

    vm.showThematicCategorySummary = showThematicCategorySummary;
    function showThematicCategorySummary () {
        $location.path('/thematicCategory/summary');
    }

    vm.showGrandArmyListSummary = showGrandArmyListSummary;
    function showGrandArmyListSummary () {
        $location.path('/grandArmyList/summary');
    }

    vm.showArmyListSummary = showArmyListSummary;
    function showArmyListSummary () {
        $location.path('/armyList/summary');
    }
}

