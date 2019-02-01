describe('ThematicCategorySummaryController', function() {
    // Load the module
    beforeEach(angular.mock.module('meshweshApp'));

    // Get the mock service
    var mockThematicCategoryService = MockThematicCategoryService();

    // Get $location
    var $location;
    beforeEach(angular.mock.inject(function(_$location_) {
        $location = _$location_;
        spyOn($location, 'path');
    }));

    // Create a controller to test
    var controller;
    beforeEach(angular.mock.inject(function($controller) {
        controller = $controller(
            'ThematicCategorySummaryController',
            { $location: $location, ThematicCategoryService: mockThematicCategoryService, mode: 'edit' }
        );
    }));

    it('should have the required properties', function() {
        expect(controller).toBeDefined();
        expect(controller.categories).toBeDefined();
        expect(controller.create).toBeDefined();
    });

    it('should navigate to the correct path on create()', function() {
        controller.create();
        expect($location.path).toHaveBeenCalledWith('/thematicCategory/create');
    });

    it('should navigate to the correct path on edit()', function() {
        controller.edit(2);
        expect($location.path).toHaveBeenCalledWith('/thematicCategory/2/edit');
    });
});

