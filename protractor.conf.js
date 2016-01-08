exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./public/tests/e2e/spec/thematicCategorySummary.spec.js'],
    capabilities: { browserName: 'chrome' }
};
