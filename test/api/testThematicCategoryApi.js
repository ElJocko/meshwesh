'use strict';

// Load environment variables
const dotenv = require('dotenv');
dotenv.load({ path: './test/config/local-test.env' });

const credentials = require('../config/credentials');
const config = require('../config/config');

const thematicCategoryService = require('../../app/services/thematicCategoryService');
const testData = require('../data/thematic-categories');
const dbConnection = require('../../app/lib/dbConnection');

const path = require('path');
const request = require('supertest');
const expect = require('expect');
const assert = require('assert');

const serverUrl = config.testServer.url;
const apiVersion = 'v1';

let retrievedThematicCategory = null;

const newThematicCategory = {
    name: 'Mongol Sky'
};
let newThematicCategoryId = null;

const invalidThematicCategories = [
    { },
    { name: '' },
    { themeName: 'Mongol Sky' }
];

let updateName = {
    admin: 'Mongol Thunder',
    editor: 'Mongol Lightning',
    visitor: 'Mongol Light Rain'
};

config.testRoles.forEach(function(role) {
    const suiteName = 'Test Role ' + role;
    const roleCredentials = credentials.get(role);
    let userToken = null;

    describe('ThematicCategory API (' + role + ')', function () {
        before(function (done) {
            // Sign in and get a token
            if (roleCredentials) {
                const apiPath = path.join('/api', apiVersion, '/userCredentials');
                request(serverUrl)
                    .post(apiPath)
                    .send(roleCredentials)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        else {
                            userToken = res.body.token;

                            return done(err);
                        }
                    });
            }
            else {
                // Don't need to sign in if we don't have credentials for this role
                return done();
            }
        });

        before(function (done) {
            // Reset the database
            thematicCategoryService.import(testData, function(err, importSummary) {
                assert.ifError(err);
                done();
            });
        });

        describe('retrieve the list of thematic categories', function () {
            it('should retrieve all of the thematic categories', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories');
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            const thematicCategories = res.body;
                            expect(thematicCategories).toExist();
                            expect(Array.isArray(thematicCategories)).toBeTruthy();
                            expect(thematicCategories.length === testData.length);

                            // Save the first thematic category for later tests
                            retrievedThematicCategory = thematicCategories[0];

                            done();
                        }
                    });
            });
        });

        describe('retrieve a thematic category', function () {
            it('should not retrieve a thematic category with a badly formatted id', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', '12345');
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
            });

            it('should not retrieve a thematic category with a non-existent id', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', config.data.badId);
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(404)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
            });

            it('should retrieve a thematic category', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            const retrievedThematicCategory = res.body;
                            expect(retrievedThematicCategory).toExist();

                            done();
                        }
                    });
            });
        });

        describe('retrieve the army lists associated with a thematic category', function () {
            it('should not retrieve army lists with a badly formatted id', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', '12345', '/armyLists');
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(400)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
            });

            it('should retrieve army lists', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id, '/armyLists');
                request(serverUrl)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            const armyLists = res.body;
                            expect(armyLists).toExist();
                            expect(Array.isArray(armyLists)).toBeTruthy();
                            expect(armyLists.length === 0);

                            done();
                        }
                    });
            });
        });

        describe('create thematic category', function () {
            invalidThematicCategories.forEach(function (invalidData) {
                it('should not create a thematic category with invalid data', function (done) {
                    const apiPath = path.join('/api', apiVersion, 'thematicCategories');
                    request(serverUrl)
                        .post(apiPath)
                        .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                        .send(invalidData)
                        .expect(userToken ? 400 : 401)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            }
                            else {
                                newThematicCategoryId = res.body.id;
                                done();
                            }
                        });
                });
            });

            it('should create a thematic category', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories');
                request(serverUrl)
                    .post(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send(newThematicCategory)
                    .expect(userToken ? 201 : 401)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            newThematicCategoryId = res.body.id;
                            done();
                        }
                    });
            });

            if (roleCredentials) {
                it('should find the new thematic category', function (done) {
                    const apiPath = path.join('/api', apiVersion, 'thematicCategories', newThematicCategoryId);
                    request(serverUrl)
                        .get(apiPath)
                        .set(userToken ? {'PRIVATE-TOKEN': userToken} : {})
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            }
                            else {
                                expect(res.body.name).toBe(newThematicCategory.name);
                                done();
                            }
                        });
                });
            }
        });

        describe('update thematic category', function () {
            invalidThematicCategories.forEach(function (invalidData) {
                it('should not update a thematic category with invalid data', function (done) {
                    newThematicCategory.name = updateName[role];
                    const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                    request(serverUrl)
                        .put(apiPath)
                        .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                        .send(invalidData)
                        .expect(userToken ? 400 : 401)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            }
                            else {
                                done();
                            }
                        });
                });
            });

            it('should update a thematic category', function (done) {
                newThematicCategory.name = updateName[role];
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                request(serverUrl)
                    .put(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send(newThematicCategory)
                    .expect(userToken ? 200: 401)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            newThematicCategoryId = res.body.id;
                            done();
                        }
                    });
            });

            if (roleCredentials) {
                it('should find the updated thematic category', function (done) {
                    const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                    request(serverUrl)
                        .get(apiPath)
                        .set(userToken ? {'PRIVATE-TOKEN': userToken} : {})
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            }
                            else {
                                expect(res.body.name).toBe(updateName[role]);
                                done();
                            }
                        });
                });
            }
        });

        describe('delete thematic category', function () {
            it('should delete a thematic category', function (done) {
                const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                request(serverUrl)
                    .del(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .expect(userToken ? 200 : 401)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
            });

            if (roleCredentials) {
                it('should not find the deleted thematic category', function (done) {
                    const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
                    request(serverUrl)
                        .get(apiPath)
                        .set(userToken ? {'PRIVATE-TOKEN': userToken} : {})
                        .expect(404)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            }
                            else {
                                done();
                            }
                        });
                });
            }
        });
    });
});

