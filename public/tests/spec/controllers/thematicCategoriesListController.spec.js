describe('ThematicCategoriesListController', function() {
    beforeEach(module('meshweshApp'));

    var controller;

    beforeEach(inject(function($controller) {
        var location = null;
        var mockService = {
            list: function() {
                return [
                    { name: 'category1' },
                    { name: 'category2' }
                ];
            }};
        controller = $controller(
            'ThematicCategoriesListController',
            { $location: location, ThematicCategoriesService: mockService }
        );
    }));

    it('should have a create function', function() {
        expect(controller).toBeDefined();
        expect(controller.categories).toBeDefined();
        expect(controller.create).toBeDefined();
    });
});

