describe('ThematicCategoriesListController', function() {
    beforeEach(module('meshweshApp'));

    var Service = MockThematicCategoriesService();

    // Mock $location
    var location;
    beforeEach(inject(function(_$location_) {
        location = _$location_;
        spyOn(location, 'path');
    }));

    // Controller to test
    var controller;
    beforeEach(inject(function($controller) {
        controller = $controller(
            'ThematicCategoriesListController',
            { $location: location, ThematicCategoriesService: Service }
        );
    }));

    it('should have the required properties', function() {
        expect(controller).toBeDefined();
        expect(controller.categories).toBeDefined();
        expect(controller.create).toBeDefined();
    });

    it('should navigate to the correct path on create()', function() {
        controller.create();
        expect(location.path).toHaveBeenCalledWith('/thematicCategories/create');
    });

    it('should navigate to the correct path on edit()', function() {
        controller.edit(2);
        expect(location.path).toHaveBeenCalledWith('/thematicCategories/2/edit');
    });
});

