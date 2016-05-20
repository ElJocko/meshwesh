angular
    .module('meshweshDirectives')
    .directive('appNavbar', NavbarDirective);

function NavbarDirective() {
    return {
        templateUrl: 'views/app-partials/navbar.html'
    };
}
