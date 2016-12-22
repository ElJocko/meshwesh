'use strict';

var path = require('path');
var request = require('supertest');
var expect = require('expect');

var serverUrl = process.env.SERVER_URL || "";
var apiVersion = 'v1';

var thematicCategory = null;

describe('ThematicCategory API', function() {

    describe('retrieve the list of thematic categories', function () {
        it('should retrieve all of the thematic categories', function (done) {
            var apiPath = path.join('/api', apiVersion, 'thematicCategories');
            request(serverUrl)
                .get(apiPath)
                .send()
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var thematicCategories = res.body;
                        expect(thematicCategories).toExist();
                        expect(Array.isArray(thematicCategories)).toBeTruthy();

                        // Save the first category for later tests
                        thematicCategory = thematicCategories[0];

                        done();
                    }
                });
        });
    });

    describe('retrieve a thematic category', function () {
        it('should retrieve a thematic category', function (done) {
            var apiPath = path.join('/api', apiVersion, 'thematicCategories', thematicCategory.id);
            request(serverUrl)
                .get(apiPath)
                .send()
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var retrievedThematicCategory = res.body;
                        expect(retrievedThematicCategory).toExist();

                        done();
                    }
                });
        });
    });

});

