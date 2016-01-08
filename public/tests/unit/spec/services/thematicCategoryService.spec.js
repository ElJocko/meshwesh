describe('ThematicCategoryService', function() {
    beforeEach(module('meshweshApp'));

    // Service to test
    var service;
    beforeEach(inject(function(ThematicCategoryService) {
        service = ThematicCategoryService;
    }));

    it('should have the required properties', function() {
        expect(service).toBeDefined();
        expect(service.create).toBeDefined();
        expect(service.list).toBeDefined();
        expect(service.get).toBeDefined();
        expect(service.update).toBeDefined();
        expect(service.destroy).toBeDefined();
    });
});

