angular
    .module('meshweshDirectives')
    .directive('mwNavbar', NavBarDirective);

function NavBarDirective() {
    return {
        templateUrl: 'views/app-partials/navbar.html'
    };
}