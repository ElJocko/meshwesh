function MockThematicCategoriesService() {
    var serviceObject = {};
    var Service = function() {
        return serviceObject;
    };

    // Class functions
    Service.list = function() {
        var categories = [
            { id: 1, name: 'category 1' },
            { id: 2, name: 'category 2' }
        ];
        return categories;
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
        spyOn(Service, 'list').and.callThrough();
        spyOn(Service, 'get').and.callThrough();
        spyOn(Service, 'create').and.callThrough();
        spyOn(Service, 'update').and.callThrough();
        spyOn(Service, 'destroy').and.callThrough();
    });

    return Service;
}

