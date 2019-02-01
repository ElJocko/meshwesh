describe('ThematicCategoryEditController', function() {
    // Load the module
    beforeEach(module('meshweshApp'));

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
    function makeController(categoryId) {
        var mockRoute = { current: { params: { categoryId: categoryId }}};
        inject(function($controller) {
            controller = $controller(
                'ThematicCategoryEditController',
                { $route: mockRoute, $location: $location, ThematicCategoryService: mockThematicCategoryService }
            );
        })
    }

    it('should have the required properties (existing category)', function() {
        makeController(2);

        expect(controller).toBeDefined();
        expect(controller.category).toBeDefined();
        expect(controller.submit).toBeDefined();
        expect(controller.delete).toBeDefined();
    });

    it('should have the required properties (new category)', function() {
        makeController();

        expect(controller).toBeDefined();
        expect(controller.category).toBeDefined();
        expect(controller.submit).toBeDefined();
        expect(controller.delete).toBeUndefined();
    });

    it('should take the correct action on submit() (existing category)', function() {
        makeController(2);
        controller.category.name = 'updated name';
        controller.submit();

        expect(mockThematicCategoryService.update).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });

    it('should take the correct action on submit() (new category)', function() {
        makeController();
        controller.category.name = 'created name';
        controller.submit();

        expect(mockThematicCategoryService.create).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });

    it('should take the correct action on delete()', function() {
        makeController(2);
        controller.delete(2);
        expect(mockThematicCategoryService.destroy).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });
});

