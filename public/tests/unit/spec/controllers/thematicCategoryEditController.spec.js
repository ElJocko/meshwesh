describe('ThematicCategoryEditController', function() {
    beforeEach(module('meshweshApp'));

    var Service = MockThematicCategoryService();

    // Mock $location
    var location;
    beforeEach(inject(function($location) {
        location = $location;
        spyOn(location, 'path');
    }));

    // Mock $routeParams
//    var routeParams;
//    beforeEach(inject(function($routeParams) {
//        routeParams = $routeParams;
//    }));

    // Controller to test
    var controller;
    function makeController(categoryId) {
        inject(function($controller) {
            controller = $controller(
                'ThematicCategoryEditController',
                { $routeParams: { categoryId: categoryId }, $location: location, ThematicCategoryService: Service }
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

        expect(Service.update).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });

    it('should take the correct action on submit() (new category)', function() {
        makeController();
        controller.category.name = 'created name';
        controller.submit();

        expect(Service.create).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });

    it('should take the correct action on delete()', function() {
        makeController(2);
        controller.delete(2);
        expect(Service.destroy).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/thematicCategory/summary');
    });
});

