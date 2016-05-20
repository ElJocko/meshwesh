angular
    .module('meshweshDirectives')
    .directive('appBanner', BannerDirective);

function BannerDirective() {
    return {
        templateUrl: 'views/app-partials/banner.html'
    };
}

