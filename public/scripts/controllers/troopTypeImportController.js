'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');

angular
    .module('meshweshControllers')
    .controller('TroopTypeImportController', TroopTypeImportController);

TroopTypeImportController.$inject = ['$location', '$scope', 'TroopTypeImportService'];

function TroopTypeImportController($location, $scope, TroopTypeImportService) {
    var vm = this;

    vm.file = null;
    vm.importTroopTypes = [];
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
                skipEmptyLines: true,
                complete: function(results) {
                    console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';

                    if (results.data) {
                        results.data.forEach(function(item) {
                            const troopType = {
                                permanentCode: item.permanentCode,
                                displayName: item.displayName,
                                displayCode: item.displayCode,
                                cost: item.cost,
                                category: item.category,
                                order: item.order,
                                description: item.description,
                                importName: item.importName,
                                combatFactors: {
                                    rangedCombat: {
                                        shooting: item.shootingFactor,
                                        shotAt: item.shotAtFactor
                                    },
                                    closeCombat : {
                                        vsFoot: item.vsFootFactor,
                                        vsMounted: item.vsMountedFactor
                                    }
                                }
                            };
                            vm.importTroopTypes.push(troopType);
                        });

                        vm.statusMessage1 = 'Found ' + vm.importTroopTypes.length + ' troop types in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 troop types in the file.';
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
        if (vm.importTroopTypes.length) {
            // Prepare the request
            var importRequest = {
                data: vm.importTroopTypes
            };

            // Import the troop types
            TroopTypeImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.imported + ' troop types.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' troop types.';
                    vm.statusMessage2 = importSummary.failed + ' troop types were not imported due to errors.';
                    vm.file = null;
                    vm.importTroopTypes = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage1 = 'Unable to import troop types.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.importTroopTypes = [];
                }
            );
        }
    }
}
