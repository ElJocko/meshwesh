'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopTypeImportController', TroopTypeImportController);

TroopTypeImportController.$inject = ['$location', '$scope', 'TroopTypeImportService'];

function TroopTypeImportController($location, $scope, TroopTypeImportService) {
    var vm = this;

    vm.file = null;
    vm.importTroopTypes = [];
    vm.statusMessage = 'No file selected';

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
                    vm.statusMessage = '';

                    if (results.data) {
                        vm.importTroopTypes = results.data;
                        vm.statusMessage = 'Found ' + vm.importTroopTypes.length + ' troop types in the file. ';
                    }
                    else {
                        vm.statusMessage = 'Found 0 troop types in the file. ';
                    }

                    if (results.errors) {
                        vm.statusMessage = vm.statusMessage + 'Encountered ' + results.errors.length + ' errors during parsing.';
                        results.errors.forEach(function (item) {
                            console.error(item);
                        });
                    }
                    else {
                        vm.statusMessage = vm.statusMessage + 'No Errors encountered during parsing.';
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
                    vm.statusMessage = 'Imported ' + importSummary.imported + ' troop types.';
                    vm.file = null;
                    vm.importTroopTypes = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage = 'Unable to import troop types.';
                    vm.file = null;
                    vm.importTroopTypes = [];
                }
            );
        }
    }
}