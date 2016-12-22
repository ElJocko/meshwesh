'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            testApi: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/api/testThematicCategoryApi.js'
                ]
            }
        },

        env: {
            mochaTest: {
                src: 'test/config/local-test.env'
            }
        }
    });

    //
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Api and Service Tests
    grunt.registerTask('test-api', ['env:mochaTest', 'mochaTest:testApi']);
};