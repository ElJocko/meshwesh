angular
    .module('meshweshDirectives')
    .directive('mwBanner', BannerDirective);

function BannerDirective() {
    return {
        templateUrl: 'views/app-partials/banner.html'
    };
}

