'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');

angular
    .module('meshweshControllers')
    .controller('BattleCardImportController', BattleCardImportController);

BattleCardImportController.$inject = ['$location', '$scope', 'BattleCardImportService'];

function BattleCardImportController($location, $scope, BattleCardImportService) {
    var vm = this;

    vm.file = null;
    vm.importBattleCards = [];
    vm.statusMessage1 = 'No file selected';
    vm.statusMessage2 = '';
    vm.importProgress = {
        numberTotal: 0,
        numberDone: 0,
        running: false
    };

    vm.importData = importData;

    document.getElementById('inputFileInput').addEventListener('change', fileSelected, false);

    function fileSelected(event) {
        vm.file = event.target.files[0];
        parseFile();
    }

    function parseFile() {
        Papa.parse(
            vm.file,
            {
                delimiter: '|',
                header: true,
                complete: function(results) {
                    console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';

                    if (results.data) {
                        results.data.forEach(function(item) {
                            const battleCard = {
                                permanentCode: item.permanentCode,
                                displayName: item.displayName,
                                importName: item.importName,
                                category: item.category
                            };
                            vm.importBattleCards.push(battleCard);
                        });

                        vm.statusMessage1 = 'Found ' + vm.importBattleCards.length + ' battle cards in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 battle cards in the file.';
                    }

                    if (results.errors) {
                        vm.statusMessage2 = 'Encountered ' + results.errors.length + ' errors during parsing.';
                        results.errors.forEach(function (item) {
                            console.error(item);
                        });
                    }
                    else {
                        vm.statusMessage2 = 'No Errors encountered during parsing.';
                    }

                    $scope.$apply();
                }
            });
    }

    function importData() {
        if (vm.importBattleCards.length) {
            // Prepare the request
            var importRequest = {
                data: vm.importBattleCards
            };

            // Import the troop types
            BattleCardImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.imported + ' battle cards.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' battle cards.';
                    vm.statusMessage2 = importSummary.failed + ' battle cards were not imported due to errors.';
                    vm.file = null;
                    vm.importBattleCards = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage1 = 'Unable to import battle cards.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.importBattleCards = [];
                }
            );
        }
    }
}