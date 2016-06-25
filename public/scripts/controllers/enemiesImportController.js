'use strict';

angular
    .module('meshweshControllers')
    .controller('EnemiesImportController', EnemiesImportController);

EnemiesImportController.$inject = ['$location', '$scope', '$interval', 'ArmyListEnemiesImportService'];

function EnemiesImportController($location, $scope, $interval, ArmyListEnemiesImportService) {
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
                        results.data.forEach(function(item, index) {
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

                            data.index = index + 1;

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

            // Only send a slice of data in each request

            // Initialize the progress bar
            vm.importProgress.numberTotal = vm.parsedData.length;
            vm.importProgress.numberDone = 0;
            vm.importProgress.running = true;

            // Slice the data
            var slicedData = [];
            var sliceSize = 50;
            var index = 0;
            var done = false;
            while (!done) {
                var start = index;
                var end = index + sliceSize;
                if (end > vm.parsedData.length) {
                    end = vm.parsedData.length;
                    if (end > start) {
                        var slice = vm.parsedData.slice(start, end);
                        slicedData.push(slice);
                    }
                    done = true;
                }
                else {
                    var slice = vm.parsedData.slice(start, end);
                    slicedData.push(slice);
                    index = end;
                }
            }

            // Send each slice
            var deleteEnemyXrefs = true;
            async.mapSeries(slicedData, importSlice, function (err, sliceSummary) {
                if (err) {
                    vm.statusMessage1 = 'Unable to import enemy data.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];

                    removeProgressBarAfterDelay();
                }
                else {
                    // Sum the summary data from each slice
                    var importSummary = sliceSummary.reduce(function (previous, current) {
                        return {
                            imported: previous.imported + current.imported,
                            failed: previous.failed + current.failed
                        }
                    });

                    // Report the results
                    console.info('Successfully imported ' + importSummary.imported + ' enemy pairs.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' enemy pairs.';
                    vm.statusMessage2 = importSummary.failed + ' enemy pairs were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];

                    removeProgressBarAfterDelay();
                }
            });
        }

        function importSlice(slice, cb) {
            var importRequest = {
                options: {
                    deleteAll: deleteEnemyXrefs
                },
                data: slice
            };

            // Import the troop types
            ArmyListEnemiesImportService.import(
                importRequest,
                function(importSummary) {
                    // Only delete on the first slice
                    deleteEnemyXrefs = false;

                    // Update the progress bar
                    vm.importProgress.numberDone = vm.importProgress.numberDone + slice.length;

                    return cb(null, importSummary);
                },
                function (response) {
                    console.error(response.data);
                    return cb(response.data);
                }
            );
        }
    }

    function removeProgressBarAfterDelay() {
        var timer = $interval(
            function() {
                vm.importProgress.running = false;
            },
            1000,
            1);
    }
}