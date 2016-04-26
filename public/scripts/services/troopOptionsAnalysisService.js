'use strict';

angular
    .module('meshweshServices')
    .factory('TroopOptionsAnalysisService', TroopOptionsAnalysisService);

TroopOptionsAnalysisService.$inject = ['TroopTypeService'];

function TroopOptionsAnalysisService(TroopTypeService) {
    var availableTroopTypes = [];
    initializeTroopTypeData();

    return {
        checkMin: function(troopOption, troopOptions) {
            var minMax = calculateMinMaxPoints(troopOption);
            var totalMax = 0;
            troopOptions.forEach(function(item) {
                if (item !== troopOption) {
                    var itemMinMax = calculateMinMaxPoints(item);
                    totalMax = totalMax + itemMinMax.maxPoints;
                }
            });
            var totalCost = totalMax + minMax.minPoints;
            return {
                ok: (totalCost > 48),
                totalCost: totalCost
            }
        },
        calculateTotalMinMaxPoints: function(troopOptions) {
            var minPoints = 0;
            var maxPoints = 0;
            troopOptions.forEach(function(item) {
                var minMax = calculateMinMaxPoints(item);
                minPoints = minPoints + minMax.minPoints;
                maxPoints = maxPoints + minMax.maxPoints;
            });

            return {
                minPoints: minPoints,
                maxPoints: maxPoints
            };
        }
    };

    function initializeTroopTypeData() {
        TroopTypeService.list(function(troopTypes) {
            availableTroopTypes = troopTypes;
        });
    }

    function calculateMinMaxPoints(troopOption) {
        if (troopOption.troopEntries.length === 0) {
            return {
                minPoints: 0,
                maxPoints: 0
            };
        }
        else {
            var minCost = 99;
            var maxCost = 0;

            troopOption.troopEntries.forEach(function (item) {
                var troopType = findTroopTypeByPermanentCode(item.troopTypeCode);
                if (troopType) {
                    if (troopType.cost < minCost) {
                        minCost = troopType.cost;
                    }
                    if (troopType.cost > maxCost) {
                        maxCost = troopType.cost;
                    }
                }
            });

            return {
                minPoints: minCost * troopOption.min,
                maxPoints: maxCost * troopOption.max
            }
        }
    }

    function findTroopTypeByPermanentCode(code) {
        var troopType = null;
        availableTroopTypes.forEach(function(item) {
            if (item.permanentCode === code) {
                troopType = item;
            }
        });
        return troopType;
    }
}


