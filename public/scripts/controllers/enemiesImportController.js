'use strict';

angular
    .module('meshweshControllers')
    .controller('EnemiesImportController', EnemiesImportController);

EnemiesImportController.$inject = ['$location', '$scope', 'ArmyListEnemiesImportService'];

function EnemiesImportController($location, $scope, ArmyListEnemiesImportService) {
    var vm = this;

    vm.file = null;
    vm.parsedData = [];
    vm.statusMessage1 = 'No file selected';
    vm.statusMessage2 = '';

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
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';

                    if (results.data) {
                        // Convert some data columns to arrays
                        results.data.forEach(function(item) {
                            // uniqueId1,uniqueId2

                            // Convert to listIds and sublistIds
                            // Default to missing sublistId, then fix
                            var data = {
                                armyList1: {
                                    listId: item.uniqueId1,
                                    sublistId: 'a'
                                },
                                armyList2: {
                                    listId: item.uniqueId2,
                                    sublistId: 'a'
                                }
                            };

                            // Split the uniqueId1 if necessary
                            var uniqueId1Length = item.uniqueId1.length;
                            if (uniqueId1Length > 0) {
                                var sublistId = item.uniqueId1[uniqueId1Length - 1];
                                if (sublistId >= 'a' && sublistId <= 'z') {
                                    // Replace the listId and sublistId
                                    data.armyList1.listId = item.uniqueId1.slice(0, uniqueId1Length - 1);
                                    data.armyList1.sublistId = sublistId;
                                }
                            }

                            // Split the uniqueId2 if necessary
                            var uniqueId2Length = item.uniqueId2.length;
                            if (uniqueId2Length > 0) {
                                var sublistId = item.uniqueId2[uniqueId2Length - 1];
                                if (sublistId >= 'a' && sublistId <= 'z') {
                                    // Replace the listId and sublistId
                                    data.armyList2.listId = item.uniqueId2.slice(0, uniqueId2Length - 1);
                                    data.armyList2.sublistId = sublistId;
                                }
                            }

                            // Make sure the listIds are numbers
                            data.armyList1.listId = Number(data.armyList1.listId);
                            data.armyList2.listId = Number(data.armyList2.listId);

                            vm.parsedData.push(data);
                        });
                        vm.statusMessage1 = 'Found ' + vm.parsedData.length + ' enemy pairs in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 army lists in the file.';
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

            // Import the troop types
            ArmyListEnemiesImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.imported + ' army lists pairs.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' army list pairs.';
                    vm.statusMessage2 = importSummary.failed + ' army list pairs were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage1 = 'Unable to import enemy data.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];
                }
            );
        }
    }
}