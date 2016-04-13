'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopOptionsImportController', TroopOptionsImportController);

TroopOptionsImportController.$inject = ['$location', '$scope', 'TroopTypeService', 'TroopOptionsImportService'];

function TroopOptionsImportController($location, $scope, TroopTypeService, TroopOptionsImportService) {
    var vm = this;

    vm.file = null;
    vm.parsedData = [];
    vm.statusMessage1 = 'No file selected';
    vm.statusMessage2 = '';

    var troopTypes = {};
    initializeTroopTypeData();

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
                delimiter: ',',
                header: true,
                complete: function(results) {
                    console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';
                    vm.parsedData = [];

                    if (results.data) {
                        // Convert the data to a flat array of troop options
                        var flatArray = [];
                        results.data.forEach(function(item) {
                            var troopOption = {
                                listId: item.listId,
                                sublistId: item.sublistId,
                                min: 0,
                                max: 0,
                                troopTypes: [],
                                description: item.description
                            };

                            // Convert minMax
                            var minMaxValues = item.minMax.split('-');
                            if (minMaxValues.length === 1) {
                                troopOption.min = minMaxValues[0];
                                troopOption.max = minMaxValues[0];
                            }
                            else if (minMaxValues.length === 2) {
                                troopOption.min = minMaxValues[0];
                                troopOption.max = minMaxValues[1];
                            }

                            // Convert troop types
                            var troopValues = item.troopTypes.split(' or ');
                            troopValues.forEach(function (value) {
                                if (troopTypes[value]) {
                                    troopOption.troopTypes.push(troopTypes[value]);
                                }
                                else {
                                    console.warn('Did not find troop type for ' + value);
                                }
                            });

                            // If the troop option is valid, add it to the parsde data
                            if (troopOption.max > 0 && troopOption.troopTypes.length > 0) {
                                flatArray.push(troopOption);
                            }
                        });

                        // Convert the flat array of troop options into an array of army lists with troop options
                        vm.parsedData = [];
                        flatArray.forEach(function(troopOption) {
                            // Terribly inefficient
                            var armyListFound = false;
                            vm.parsedData.forEach(function(armyList) {
                                if (armyList.listId === troopOption.listId && armyList.sublistId === troopOption.sublistId) {
                                    armyList.troopOptions.push(troopOption);
                                    armyListFound = true;
                                }
                            });
                            if (!armyListFound) {
                                var armyList = {
                                    listId: troopOption.listId,
                                    sublistId: troopOption.sublistId,
                                    troopOptions: []
                                };
                                armyList.troopOptions.push(troopOption);
                                vm.parsedData.push(armyList);
                            }
                        });

                        vm.statusMessage1 = 'Found ' + flatArray.length + ' troop options in ' + vm.parsedData.length + ' army lists in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 troop options in the file.';
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
        if (vm.parsedData.length) {
            // Prepare the request
            var importRequest = {
                data: vm.parsedData
            };

            // Import the troop options
            TroopOptionsImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.');
                    console.warn(importSummary.errors);
                    vm.statusMessage1 = 'Imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.';
                    vm.statusMessage2 = importSummary.failedArmyLists + ' army lists were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage1 = 'Unable to import troop options.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];
                }
            );
        }
    }

    function initializeTroopTypeData() {
        TroopTypeService.list(function(availableTroopTypes) {
            availableTroopTypes.forEach(function (item) {
                troopTypes[item.displayName] = item.permanentCode;
            });
        });
    }
}