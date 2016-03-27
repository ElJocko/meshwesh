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
                    vm.importTroopTypes = results.data;
                    vm.statusMessage = 'Found ' + vm.importTroopTypes.length + ' troop types in the file.';
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
                    console.log('Successfully created ' + importSummary.created + ' troop types.');
                    vm.statusMessage = 'Created ' + importSummary.created + ' troop types.';
                },
                function (response) {
                    console.error(response.data);
                }
            );
        }
    }
}