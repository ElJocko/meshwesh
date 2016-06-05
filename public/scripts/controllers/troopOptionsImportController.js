'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopOptionsImportController', TroopOptionsImportController);

TroopOptionsImportController.$inject = ['$location', '$scope', '$interval', 'TroopTypeService', 'TroopOptionsImportService'];

function TroopOptionsImportController($location, $scope, $interval, TroopTypeService, TroopOptionsImportService) {
    var vm = this;

    vm.file = null;
    vm.parsedData = [];
    vm.statusMessage1 = 'No file selected';
    vm.statusMessage2 = '';

    vm.importProgress = {
        running: false,
        numberTotal: 0,
        numberDone: 0
    };

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
                    //console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';
                    vm.parsedData = [];

                    if (results.data) {
                        console.log('Read ' + results.data.length + ' rows from file.');
                        // Convert the data to a flat array of troop options
                        var flatArray = [];
                        var errorRows = 0;
                        results.data.forEach(function(item) {
                            // TBD: z troops are internal ally
                            if (item.troopOptionOrder && item.troopOptionOrder !== '0' && item.sublistId !== 'w' && item.sublistId !== 'x' && item.sublistId !== 'y' && item.sublistId !== 'z') {
                                var troopOption = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    min: 0,
                                    max: 0,
                                    allyMin: 0,
                                    allyMax: 0,
                                    troopEntries: [],
                                    description: item.description,
                                    core: ''
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
                                var troopEntryList = item.troopEntries.split(' or ');
                                troopEntryList.forEach(function (entry) {
                                    entry = entry.trim();
                                    // Remove any trailing 's'
                                    if (entry.endsWith('s')) {
                                        entry = entry.slice(0, -1);
                                    }

                                    // Check for dismounting type
                                    var dismountIndex = entry.indexOf('//');
                                    var mainEntry = null;
                                    var dismountEntry = null;
                                    if (dismountIndex === -1) {
                                        mainEntry = entry;
                                    }
                                    else {
                                        mainEntry = entry.slice(0, dismountIndex);
                                        dismountEntry = entry.slice(dismountIndex + 2);
                                    }

                                    // Lookup the codes
                                    var mainCode = troopTypes[mainEntry.toUpperCase()];
                                    var dismountCode = null;
                                    if (dismountEntry) {
                                        dismountCode = troopTypes[dismountEntry.toUpperCase()];
                                    }

                                    // Issue warnings for unknown names
                                    if (mainCode === null) {
                                        console.warn('Did not find troop type for ' + mainEntry + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    if (dismountEntry && dismountCode === null) {
                                        console.warn('Did not find troop type for dismount entry ' + dismountEntry + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    // Add the troop entry
                                    if (mainCode) {
                                        troopOption.troopEntries.push({ troopTypeCode: mainCode, dismountTypeCode: dismountCode });
                                    }

                                    // Check for core
                                    if (item.core.toLowerCase() === 'core') {
                                        troopOption.core = 'all';
                                    }
                                    else if (item.core.toLowerCase() === 'half core') {
                                        troopOption.core = 'half'
                                    }
                                    else if (item.core.length > 0) {
                                        console.warn('Core contained unexpected text: ' + item.core);
                                    }
                                });

                                // If the troop option is valid, add it to the parsed data
                                if (troopOption.max > 0 && troopOption.troopEntries.length > 0) {
                                    flatArray.push(troopOption);
                                }
                                else {
                                    var itemString = JSON.stringify(item);
                                    console.log('Unable to convert item: ' + itemString);

                                    errorRows = errorRows + 1;
                                }
                            }
                        });

                        console.log('Converted ' + flatArray.length + ' troop option rows.')
                        console.log('Unable to convert ' + errorRows + ' troop option rows.');

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

            // Only send a slice of data in each request

            // Initialize the progress bar
            vm.importProgress.numberTotal = vm.parsedData.length;
            vm.importProgress.numberDone = 0;
            vm.importProgress.running = true;

            // Slice the data
            var slicedData = [];
            var sliceSize = 100;
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

            // Send the each slice
            async.mapSeries(slicedData, importSlice, function(err, sliceSummary) {
                if (err) {
                    vm.statusMessage1 = 'Unable to import troop options.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];

                    removeProgressBarAfterDelay();
                }
                else {
                    // Sum the summary data from each slice
                    var importSummary = sliceSummary.reduce(function (previous, current) {
                        return {
                            importedTroopOptions: previous.importedTroopOptions + current.importedTroopOptions,
                            importedArmyLists: previous.importedArmyLists + current.importedArmyLists,
                            failedArmyLists: previous.failedArmyLists + current.failedArmyLists
                        }
                    });

                    // Report the results
                    console.info('Successfully imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.');
                    console.warn(importSummary.errors);
                    vm.statusMessage1 = 'Imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.';
                    vm.statusMessage2 = importSummary.failedArmyLists + ' army lists were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];

                    removeProgressBarAfterDelay();
                }
            });
        }
    }

    function importSlice(slice, cb) {
        var importRequest = {
            data: slice
        };

        // Import the troop options
        TroopOptionsImportService.import(
            importRequest,
            function(importSummary) {
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

    function initializeTroopTypeData() {
        TroopTypeService.list(function(availableTroopTypes) {
            availableTroopTypes.forEach(function (item) {
                troopTypes[item.importName.toUpperCase()] = item.permanentCode;
            });
        });
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