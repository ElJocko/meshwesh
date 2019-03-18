describe('Thematic Category Summary', function() {
    it('should display a list of thematic categories', function() {
        browser.get('http://localhost:3000');

        // Navigate to the Thematic Category Summary page
        element(by.id('thematic-category-summary-link')).click();

        // Verify correct information is displayed
        var categoryList = element.all(by.repeater('category in vm.categories'));
        expect(categoryList.count()).toBeGreaterThan(0);
    });
});

