angular
    .module('meshweshDirectives')
    .directive('navbarAdmin', NavBarAdminDirective)
    .directive('navbarVisitor', NavBarVisitorDirective);

function NavBarAdminDirective() {
    return {
        templateUrl: 'views/app-partials/navbarAdmin.html'
    };
}

function NavBarVisitorDirective() {
    return {
        templateUrl: 'views/app-partials/navbarVisitor.html'
    };
}