'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');

angular
    .module('meshweshControllers')
    .controller('ThematicCategoryImportController', ThematicCategoryImportController);

ThematicCategoryImportController.$inject = ['$location', '$scope', 'ThematicCategoryImportService'];

function ThematicCategoryImportController($location, $scope, ThematicCategoryImportService) {
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
                skipEmptyLines: true,
                complete: function(results) {
                    console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';

                    if (results.data) {
                        vm.parsedData = results.data;
                        vm.statusMessage1 = 'Found ' + vm.parsedData.length + ' thematic categories in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 thematic categories in the file.';
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
            ThematicCategoryImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.imported + ' thematic categories.');
                    vm.statusMessage1 = 'Imported ' + importSummary.imported + ' thematic categories.';
                    vm.statusMessage2 = importSummary.failed + ' thematic categories were not imported due to errors.';

                    vm.file = null;
                    vm.parsedData = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage1 = 'Unable to import thematic categories.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];
                }
            );
        }
    }
}
