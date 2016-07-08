angular
    .module('meshweshDirectives')
    .directive('troopDescription', TroopDescription);

function TroopDescription() {
    return {
        restrict: 'E',
        scope: {
            troop: '=troop',
            showImage: '&showImage'
        },
        templateUrl: 'views/partials/troopDescriptionDirective.html'
    };
}
