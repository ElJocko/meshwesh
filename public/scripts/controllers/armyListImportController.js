'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');
const async = require ('../../../node_modules/async/dist/async');

angular
    .module('meshweshControllers')
    .controller('ArmyListImportController', ArmyListImportController);

ArmyListImportController.$inject = ['$location', '$scope', '$interval', 'ArmyListImportService'];

function ArmyListImportController($location, $scope, $interval, ArmyListImportService) {
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

    var validHomeTopographies = ['Arable', 'Delta', 'Hilly', 'Dry', 'Forest', 'Steppe', 'Marsh'];

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
                        results.data.forEach(function(item) {
                            // sortId,sublistId,name,uniqueId,startDate,endDate,invasionRatings,maneuverRatings,category1,category2,category3,category4,category5

                            // Add listIds
                            if (!item.uniqueId) {
                                console.log(JSON.stringify(item));
                            }
                            var uniqueIdLength = item.uniqueId.length;
                            if (uniqueIdLength > 0 && item.uniqueId[uniqueIdLength - 1] === item.sublistId) {
                                // Last character of uniqueId is the sublistId
                                item.listId = item.uniqueId.slice(0, uniqueIdLength - 1);
                            }
                            else {
                                // uniqueId is missing the sublist id
                                item.listId = item.uniqueId;
                                item.uniqueId = item.uniqueId + item.sublistId;
                            }

                            // Convert dateRanges
                            item.dateRanges = [];
                            if (item.startDate && item.endDate) {
                                var dateRange = { startDate: item.startDate, endDate: item.endDate };
                                item.dateRanges.push(dateRange);
                                item.startDate = null;
                                item.endDate = null;
                            }

                            // Convert invasionRatings
                            var tempArray = [];
                            if (item.invasionRatings) {
                                var ratings = item.invasionRatings.split(';');
                                ratings.forEach(function(rating) {
                                    var parts = rating.split(':');
                                    var note = null;
                                    if (parts.length === 1) {
                                        var annotatedInvasionRating = { value: parts[0].trim(), note: null };
                                        tempArray.push(annotatedInvasionRating);
                                    }
                                    else if (parts.length === 2) {
                                        annotatedInvasionRating = { value: parts[1].trim(), note: parts[0].trim() };
                                        tempArray.push(annotatedInvasionRating);
                                    }
                                    else {
                                        console.log('Invasion Rating: ' + rating + ' is invalid (' + item.uniqueId + ')');
                                    }
                                });

                                item.invasionRatings = tempArray;
                            }

                            // Convert maneuverRatings
                            tempArray = [];
                            if (item.maneuverRatings) {
                                var ratings = item.maneuverRatings.split(';');
                                ratings.forEach(function(rating) {
                                    var parts = rating.split(':');
                                    var note = null;
                                    if (parts.length === 1) {
                                        var annotatedManeuverRating = { value: parts[0].trim(), note: null };
                                        tempArray.push(annotatedManeuverRating);
                                    }
                                    else if (parts.length === 2) {
                                        annotatedManeuverRating = { value: parts[1].trim(), note: parts[0].trim() };
                                        tempArray.push(annotatedManeuverRating);
                                    }
                                    else {
                                        console.log('Maneuver Rating: ' + rating + ' is invalid (' + item.uniqueId + ')');
                                    }
                                });
                                item.maneuverRatings = tempArray;
                            }

                            // Convert homeTopographies
                            tempArray = [];
                            if (item.homeTopographies) {
                                var groups = item.homeTopographies.split(';');
                                groups.forEach(function(group) {
                                    var parts = group.split(':');
                                    var note = null;
                                    var values = null;
                                    if (parts.length === 1) {
                                        note = '';
                                        values = parts[0].split(',');
                                    }
                                    else if (parts.length === 2) {
                                        note = parts[0].trim();
                                        values = parts[1].split(',');
                                    }
                                    else {
                                        console.log('Home Topography: ' + group + ' is invalid (' + item.uniqueId + ')');
                                        values = [];
                                    }

                                    // Validate the topography values
                                    values.forEach(function(value) {
                                        value = value.trim();
                                        if (!validHomeTopographies.includes(value)) {
                                            console.log('Home Topography: ' + value + ' is not a legal topography (' + item.uniqueId + ')');
                                        }
                                    });

                                    var homeTopography = { note: note, values: values };
                                    tempArray.push(homeTopography);

                                });

                                item.homeTopographies = tempArray;
                            }

                            // Convert Thematic Categories
                            // Cleanup the thematic category data
                            if (item.category1) {
                                item.category1 = item.category1.trim();
                                if (item.category1 === '99: Andes and Amazon') {
                                    item.category1 = 'Andes and Amazon';
                                }
                                else if (item.category1 === '999: New World') {
                                    item.category1 = 'New World';
                                }
                            }

                            if (item.category2) {
                                item.category2 = item.category2.trim();
                                if (item.category2 === '99: Andes and Amazon') {
                                    item.category2 = 'Andes and Amazon';
                                }
                                else if (item.category2 === '999: New World') {
                                    item.category2 = 'New World';
                                }
                            }

                            if (item.category3) {
                                item.category3 = item.category3.trim();
                                if (item.category3 === '99: Andes and Amazon') {
                                    item.category3 = 'Andes and Amazon';
                                }
                                else if (item.category3 === '999: New World') {
                                    item.category3 = 'New World';
                                }
                            }

                            if (item.category4) {
                                item.category4 = item.category4.trim();
                                if (item.category4 === '99: Andes and Amazon') {
                                    item.category4 = 'Andes and Amazon';
                                }
                                else if (item.category4 === '999: New World') {
                                    item.category4 = 'New World';
                                }
                            }

                            if (item.category5) {
                                item.category5 = item.category5.trim();
                                if (item.category5 === '99: Andes and Amazon') {
                                    item.category5 = 'Andes and Amazon';
                                }
                                else if (item.category5 === '999: New World') {
                                    item.category5 = 'New World';
                                }
                            }


                            item.thematicCategories = [];
                            if (item.category1 && item.category1.length > 0) {
                                item.thematicCategories.push(item.category1);
                            }
                            if (item.category2 && item.category2.length > 0) {
                                item.thematicCategories.push(item.category2);
                            }
                            if (item.category3 && item.category3.length > 0) {
                                item.thematicCategories.push(item.category3);
                            }
                            if (item.category4 && item.category4.length > 0) {
                                item.thematicCategories.push(item.category4);
                            }
                            if (item.category5 && item.category5.length > 0) {
                                item.thematicCategories.push(item.category5);
                            }
                        });
                        vm.parsedData = results.data;
                        vm.statusMessage1 = 'Found ' + vm.parsedData.length + ' army lists in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 army lists in the file.';
                    }

                    if (results.errors && results.errors.length) {
                        vm.statusMessage2 = 'Encountered ' + results.errors.length + ' errors during parsing.';
                        results.errors.forEach(function (item) {
                            console.error(item);
                        });
                    }
                    else {
                        vm.statusMessage2 = 'No Errors encountered during parsing.';
                        console.log('No errors during parsing.');
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
            var deleteArmyLists = true;
            async.mapSeries(slicedData, importSlice, function (err, sliceSummary) {
                if (err) {
                    vm.statusMessage1 = 'Unable to import army lists.';
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
                    console.info('Successfully imported ' + importSummary.imported + ' army lists.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' army lists.';
                    vm.statusMessage2 = importSummary.failed + ' army lists were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];

                    removeProgressBarAfterDelay();
                }
            });
        }

        function importSlice(slice, cb) {
            var importRequest = {
                options: {
                    deleteAll: deleteArmyLists
                },
                data: slice
            };

            // Import the army lists
            ArmyListImportService.import(
                importRequest,
                function (importSummary) {
                    // Only delete on the first slice
                    deleteArmyLists = false;

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
