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
                        var armyListArray = [];
                        var errorRows = 0;
                        results.data.forEach(function(item) {
                            // Check for an army list line
                            if (item.general && item.general.length > 0) {
                                var armyListData = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    troopEntriesForGeneral: [],
                                    status: item.description
                                };

                                // Convert troop types
                                var generalEntryList = item.general.split(',');
                                var conversionResults = _.map(generalEntryList, convertTextToTroopEntry);
                                conversionResults.forEach(function(result) {
                                    // Issue warnings for unknown names
                                    if (result.troopEntry.troopTypeCode === null) {
                                        console.warn('Did not find troop type for general ' + result.mainText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    if (result.dismountText && result.troopEntry.dismountTypeCode === null) {
                                        console.warn('Did not find troop type for general dismount entry ' + result.dismountText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    // Save the troop entry
                                    if (result.troopEntry.troopTypeCode) {
                                        armyListData.troopEntriesForGeneral.push(result.troopEntry);
                                    }
                                });



                                if (!armyListData.status) {
                                    armyListData.status = 'Draft';
                                }

                                armyListArray.push(armyListData);
                            }
                            // TBD: z troops are internal ally
                            else if (item.troopOptionOrder && item.troopOptionOrder !== '0' && item.sublistId !== 'w' && item.sublistId !== 'x' && item.sublistId !== 'y' && item.sublistId !== 'z') {
                                var troopOption = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    min: 0,
                                    max: 0,
                                    allyMin: 0,
                                    allyMax: 0,
                                    dateRange: { startDate: item.startDate, endDate: item.endDate },
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

                                // Convert allyMinMax
                                if (item.allyMinMax) {
                                    var allyMinMaxValues = item.allyMinMax.split('-');
                                    if (allyMinMaxValues.length === 1) {
                                        troopOption.allyMin = allyMinMaxValues[0];
                                        troopOption.allyMax = allyMinMaxValues[0];
                                    }
                                    else if (allyMinMaxValues.length === 2) {
                                        troopOption.allyMin = allyMinMaxValues[0];
                                        troopOption.allyMax = allyMinMaxValues[1];
                                    }
                                }

                                // Convert troop types
                                var textTroopEntries = item.troopEntries.split(' or ');
                                var conversionResults = _.map(textTroopEntries, convertTextToTroopEntry);
                                conversionResults.forEach(function(result) {
                                    // Issue warnings for unknown names
                                    if (result.troopEntry.troopTypeCode === null) {
                                        console.warn('Did not find troop type for ' + result.mainText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    if (result.dismountText && result.troopEntry.dismountTypeCode === null) {
                                        console.warn('Did not find troop type for dismount entry ' + result.dismountText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    // Save the troop entry
                                    if (result.troopEntry.troopTypeCode) {
                                        troopOption.troopEntries.push(result.troopEntry);
                                    }
                                });

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

                                // Check date ranges
                                if (troopOption.dateRange.startDate) {
                                    if (!troopOption.dateRange.endDate) {
                                        // No end date. Copy the start date.
                                        troopOption.dateRange.endDate = troopOption.dateRange.startDate;
                                    }
                                }
                                else {
                                    // No start date. Don't use a dateRange at all.
                                    troopOption.dateRange = null;
                                }

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

                        console.log('Converted ' + armyListArray.length + ' army rows.');
                        console.log('Converted ' + flatArray.length + ' troop option rows.')
                        console.log('Unable to convert ' + errorRows + ' troop option rows.');

                        // Convert the flat array of troop options into an array of army lists with troop options

                        // First, convert the data from the army list rows
                        vm.parsedData = [];
                        armyListArray.forEach(function(armyList) {
                            armyList.troopOptions = [];
                            vm.parsedData.push(armyList);
                        });

                        // Second, copy the troop option data to the matching army list
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
                                // Not found, create a new army list object
                                var armyList = {
                                    listId: troopOption.listId,
                                    sublistId: troopOption.sublistId,
                                    troopOptions: [],
                                    troopEntriesForGeneral: [],
                                    status: 'Unknown'
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

            // Send each slice
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

    function convertTextToTroopEntry(entryText) {
        entryText = entryText.trim();
        // Remove any trailing 's'
        if (entryText.endsWith('s')) {
            entryText = entryText.slice(0, -1);
        }

        // Check for an annotation: [note]
        var note = null;
        var startBracketIndex = entryText.indexOf('[');
        if (startBracketIndex >= 0) {
            var endBracketIndex = entryText.indexOf(']');
            if (endBracketIndex >= 0) {
                note = entryText.slice(startBracketIndex + 1, endBracketIndex);
                entryText = entryText.slice(endBracketIndex + 1);
                entryText = entryText.trim();
                console.log('found note: ' + note + ' leaving ' + entryText);
            }
        }

        // Check for dismounting type
        var dismountIndex = entryText.indexOf('//');
        var mainText = null;
        var dismountText = null;
        if (dismountIndex === -1) {
            mainText = entryText;
        }
        else {
            mainText = entryText.slice(0, dismountIndex);
            dismountText = entryText.slice(dismountIndex + 2);
        }

        // Lookup the codes
        var mainCode = troopTypes[mainText.toUpperCase()];
        var dismountCode = null;
        if (dismountText) {
            dismountCode = troopTypes[dismountText.toUpperCase()];
        }

        var troopEntry = {
            troopTypeCode: mainCode,
            dismountTypeCode: dismountCode,
            note: note
        };

        var result = {
            mainText: mainText,
            dismountText: dismountText,
            troopEntry: troopEntry
        };

        return result;
    }
}