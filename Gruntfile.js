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
            },
            testServices: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/services/testThematicCategoryService.js'
                ]
            }
        },

        env: {
            mochaTest: {
                src: 'test/config/env/test.env'
            }
        }
    });

    //
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Api and Service Tests
    grunt.registerTask('testApi', ['env:mochaTest', 'mochaTest:testApi']);
    grunt.registerTask('testServices', ['env:mochaTest', 'mochaTest:testServices']);
};