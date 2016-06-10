angular
    .module('meshweshDirectives')
    .directive('appFooter', FooterDirective);

function FooterDirective() {
    return {
        templateUrl: 'views/app-partials/footer.html'
    };
}
