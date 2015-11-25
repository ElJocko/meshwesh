describe('ThematicCategoriesEditController', function() {
    beforeEach(module('meshweshApp'));

    // Mock ThematicCategoriesService
    var serviceObject = {};
    var Service = function() {
        return serviceObject;
    };
    Service.get = function(params) {
        return { id: params.id, name: 'initial name' };
    };
    Service.create = function(category, onSuccess, onError) {
        onSuccess(category);
    };
    Service.update = function(params, category, onSuccess, onError) {
        onSuccess(category);
    };
    Service.destroy = function(params, onSuccess, onError) {
        onSuccess({ id: params.id, name: 'destroyed!!' });
    };

    // Add spies for the service functions
    beforeEach(function() {
        spyOn(Service, 'get').and.callThrough();
        spyOn(Service, 'create').and.callThrough();
        spyOn(Service, 'update').and.callThrough();
        spyOn(Service, 'destroy').and.callThrough();
    });

    // Mock $location
    var location;
    beforeEach(inject(function($location) {
        location = $location;
        spyOn(location, 'path');
    }));

    // Mock $routeParams
    var routeParams;
    beforeEach(inject(function($routeParams) {
        routeParams = $routeParams;
    }));

    // Controller to test
    var controller;
    function makeController(categoryId) {
        inject(function($controller) {
            controller = $controller(
                'ThematicCategoriesEditController',
                { $routeParams: { categoryId: categoryId }, $location: location, ThematicCategoriesService: Service }
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
        expect(location.path).toHaveBeenCalledWith('/thematicCategories/list');
    });

    it('should take the correct action on submit() (new category)', function() {
        makeController();
        controller.category.name = 'created name';
        controller.submit();

        expect(location.path).toHaveBeenCalledWith('/thematicCategories/list');
    });

    it('should take the correct action on delete()', function() {
        makeController(2);
        controller.delete(2);
        expect(Service.destroy).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/thematicCategories/list');
    });
});

