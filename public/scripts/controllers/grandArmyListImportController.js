'use strict';

angular
    .module('meshweshControllers')
    .controller('GrandArmyListImportController', GrandArmyListImportController);

GrandArmyListImportController.$inject = ['$location', '$scope', 'GrandArmyListImportService'];

function GrandArmyListImportController($location, $scope, GrandArmyListImportService) {
    var vm = this;

    vm.file = null;
    vm.importGrandArmyLists = [];
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
                delimiter: ',',
                header: true,
                complete: function(results) {
                    console.log(results);
                    vm.statusMessage = '';

                    if (results.data) {
                        vm.importGrandArmyLists = results.data;
                        vm.statusMessage = 'Found ' + vm.importGrandArmyLists.length + ' grand army lists in the file. ';
                    }
                    else {
                        vm.statusMessage = 'Found 0 grand army lists in the file. ';
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
        if (vm.importGrandArmyLists.length) {
            // Prepare the request
            var importRequest = {
                data: vm.importGrandArmyLists
            };

            // Import the troop types
            GrandArmyListImportService.import(
                importRequest,
                function(importSummary) {
                    console.info('Successfully imported ' + importSummary.imported + ' grand army lists.');
                    vm.statusMessage = 'Imported ' + importSummary.imported + ' grand army lists.';
                    vm.file = null;
                    vm.importGrandArmyLists = [];
                },
                function (response) {
                    console.error(response.data);
                    vm.statusMessage = 'Unable to import grand army lists.';
                    vm.file = null;
                    vm.importGrandArmyLists = [];
                }
            );
        }
    }
}