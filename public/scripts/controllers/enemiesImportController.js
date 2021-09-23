'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');
const async = require ('../../../node_modules/async/dist/async');

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
                delimiter: ',',
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';

                    if (results.data) {
                        // Convert some data columns to arrays
                        results.data.forEach(function(item, index) {
                            // x1,x2,y1,y2

                            item.x1 = item.x1.trim();
                            item.x2 = item.x2.trim();
                            item.y1 = item.y1.trim();
                            item.y2 = item.y2.trim();

                            if (item.x1.length && item.y1.length) {
                                addEnemyPair(item.x1, item.y1, index);
                            }

                            if (item.x1.length && item.y2.length) {
                                addEnemyPair(item.x1, item.y2, index);
                            }

                            if (item.x2.length && item.y1.length) {
                                addEnemyPair(item.x2, item.y1, index);
                            }

                            if (item.x2.length && item.y2.length) {
                                addEnemyPair(item.x2, item.y2, index);
                            }
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

    function addEnemyPair(x, y, index) {
        // Convert to listIds and sublistIds
        // Default to missing sublistId, then fix

        var data = {
            armyList1: {
                listId: x,
                sublistId: 'a'
            },
            armyList2: {
                listId: y,
                sublistId: 'a'
            }
        };

        // Split x if necessary
        var xLength = x.length;
        if (xLength > 0) {
            var sublistId = x[xLength - 1];
            if (sublistId >= 'a' && sublistId <= 'z') {
                // Replace the listId and sublistId
                data.armyList1.listId = x.slice(0, xLength - 1);
                data.armyList1.sublistId = sublistId;
            }
        }

        // Split y if necessary
        var yLength = y.length;
        if (yLength > 0) {
            var sublistId = y[yLength - 1];
            if (sublistId >= 'a' && sublistId <= 'z') {
                // Replace the listId and sublistId
                data.armyList2.listId = y.slice(0, yLength - 1);
                data.armyList2.sublistId = sublistId;
            }
        }

        // Make sure the listIds are numbers
        data.armyList1.listId = Number(data.armyList1.listId);
        data.armyList2.listId = Number(data.armyList2.listId);

        data.index = index + 2;

        vm.parsedData.push(data);
    }
}
