'use strict';

angular
    .module('meshweshControllers')
    .controller('TroopTypeDescriptionController', TroopTypeDescriptionController);

TroopTypeDescriptionController.$inject = ['$location', '$uibModal', 'TroopTypeService'];

function TroopTypeDescriptionController($location, $uibModal, TroopTypeService) {
    var vm = this;

    vm.troopTypes = {};
    initializeTroopTypeData();

    function initializeTroopTypeData() {
        TroopTypeService.list(function(availableTroopTypes) {
            availableTroopTypes.forEach(function (item) {
                vm.troopTypes[item.permanentCode] = item;
            });

            // Hard code the image source for now. Later these images will be in the database and linked.
            vm.troopTypes['ARC'].imageSource = 'images/troopTypes/archers.png';
            vm.troopTypes['PAV'].imageSource = 'images/troopTypes/pavisiers.png';
            vm.troopTypes['SKM'].imageSource = 'images/troopTypes/skirmishers.png';
            vm.troopTypes['BLV'].imageSource = 'images/troopTypes/bow-levy.png';

            vm.troopTypes['LFT'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['LSP'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['RDR'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['WBD'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['RBL'].imageSource = 'images/troopTypes/noimage.png';

            vm.troopTypes['EFT'].imageSource = 'images/troopTypes/elite-foot.png';
            vm.troopTypes['SPR'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['WRR'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['HFT'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['PIK'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['HRD'].imageSource = 'images/troopTypes/noimage.png';

            vm.troopTypes['ECV'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['HBW'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['JCV'].imageSource = 'images/troopTypes/javelin-cavalry.png';
            vm.troopTypes['BAD'].imageSource = 'images/troopTypes/noimage.png';

            vm.troopTypes['KNT'].imageSource = 'images/troopTypes/knights.png';
            vm.troopTypes['CAT'].imageSource = 'images/troopTypes/noimage.png';

            vm.troopTypes['CHT'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['BTX'].imageSource = 'images/troopTypes/noimage.png';

            vm.troopTypes['WWG'].imageSource = 'images/troopTypes/war-wagon.png';
            vm.troopTypes['ART'].imageSource = 'images/troopTypes/artillery.png';
            vm.troopTypes['ELE'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['CML'].imageSource = 'images/troopTypes/noimage.png';
        });
    }

    vm.showImage = showImage;
    function showImage(troopType) {
        console.log('will show ' + troopType);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/modals/imageDisplay.html',
            controller: 'ImageDisplayController',
            controllerAs: 'vm',
            resolve: {
                troopType: function () {
                    return vm.troopTypes[troopType];
                }
            }
        });
    }
}