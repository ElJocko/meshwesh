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

            vm.troopTypes['LFT'].imageSource = 'images/troopTypes/light-foot.png';
            vm.troopTypes['LSP'].imageSource = 'images/troopTypes/light-spear.png';
            vm.troopTypes['RDR'].imageSource = 'images/troopTypes/raiders.png';
            vm.troopTypes['WBD'].imageSource = 'images/troopTypes/warband.png';
            vm.troopTypes['RBL'].imageSource = 'images/troopTypes/rabble.png';

            vm.troopTypes['EFT'].imageSource = 'images/troopTypes/elite-foot.png';
            vm.troopTypes['SPR'].imageSource = 'images/troopTypes/spears.png';
            vm.troopTypes['WRR'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['HFT'].imageSource = 'images/troopTypes/heavy-foot.png';
            vm.troopTypes['PIK'].imageSource = 'images/troopTypes/noimage.png';
            vm.troopTypes['HRD'].imageSource = 'images/troopTypes/horde.png';

            vm.troopTypes['ECV'].imageSource = 'images/troopTypes/elite-cavalry.png';
            vm.troopTypes['HBW'].imageSource = 'images/troopTypes/horse-bow.png';
            vm.troopTypes['JCV'].imageSource = 'images/troopTypes/javelin-cavalry.png';
            vm.troopTypes['BAD'].imageSource = 'images/troopTypes/bad-horse.png';

            vm.troopTypes['KNT'].imageSource = 'images/troopTypes/knights.png';
            vm.troopTypes['CAT'].imageSource = 'images/troopTypes/cataphracts.png';

            vm.troopTypes['CHT'].imageSource = 'images/troopTypes/chariots.png';
            vm.troopTypes['BTX'].imageSource = 'images/troopTypes/battle-taxi.png';

            vm.troopTypes['WWG'].imageSource = 'images/troopTypes/war-wagon.png';
            vm.troopTypes['ART'].imageSource = 'images/troopTypes/artillery.png';
            vm.troopTypes['ELE'].imageSource = 'images/troopTypes/elephants.png';
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