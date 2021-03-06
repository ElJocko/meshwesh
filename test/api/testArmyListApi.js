'use strict';

// Load environment variables
const dotenv = require('dotenv');
dotenv.load({ path: './test/config/local-test.env' });

const credentials = require('../config/credentials');
const config = require('../config/config');

const userService = require('../../app/services/userService');
const armyListService = require('../../app/services/armyListService');
const testData = require('../data/army-lists');

const database = require('../../app/lib/database-in-memory')

const troopTypeService = require('../../app/services/troopTypeService');
const troopTypeTestData = require('../data/troop-types');

const path = require('path');
const request = require('supertest');
const expect = require('expect');
const assert = require('assert');

const apiVersion = 'v1';

let retrievedArmyList = null;

config.testRoles.forEach(function(role) {
    const suiteName = 'Test Role ' + role;
    const roleCredentials = credentials.get(role);
    let userToken = null;

    describe('ArmyList API (' + role + ')', function () {
        let app;
        before(async function() {
            // Establish the database connection
            // Use an in-memory database that we spin up for the test
            await database.initializeConnection();

            // Create the app
            app = await require('../../app').initializeApp();
        });

        before(function (done) {
            // Add the test user to the database
            if (roleCredentials) {
                const testUser = {
                    role: role,
                    emailAddress: roleCredentials.emailAddress,
                    password: roleCredentials.password
                }
                userService.create(testUser, function (err, user) {
                    assert.ifError(err);
                    return done();
                });
            }
            else {
                return done();
            }
        });

        before(function (done) {
            // Sign in and get a token
            if (roleCredentials) {
                const apiPath = path.join('/api', apiVersion, '/userCredentials');
                request(app)
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
            // Reset the database (army lists)
            armyListService.import({ data: testData }, function(err, importSummary) {
                assert.ifError(err);
                done();
            });
        });

        before(function (done) {
            // Reset the database (troop types)
            troopTypeService.import({ data: troopTypeTestData }, function(err, importSummary) {
                assert.ifError(err);
                done();
            });
        });

        describe('retrieve the list of army lists', function () {
            it('should retrieve all of the army lists', function (done) {
                const apiPath = path.join('/api', apiVersion, 'armyLists');
                request(app)
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
                            expect(Array.isArray(armyLists)).toBe(true);

                            // Save the first thematic category for later tests
                            expect(armyLists.length > 0).toBe(true);
                            retrievedArmyList = armyLists[0];

                            done();
                        }
                    });
            });
        });

        describe('retrieve an army list', function () {
            it('should not retrieve an army list with a badly formatted id', function (done) {
                const apiPath = path.join('/api', apiVersion, 'armyLists', '12345');
                request(app)
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

            it('should not retrieve an army list with a non-existent id', function (done) {
                const apiPath = path.join('/api', apiVersion, 'armyLists', config.data.nonexistentId);
                request(app)
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

            it('should retrieve an army list', function (done) {
                const apiPath = path.join('/api', apiVersion, 'armyLists', retrievedArmyList.id);
                request(app)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            const retrievedArmyList = res.body;
                            expect(retrievedArmyList).toExist();

                            done();
                        }
                    });
            });

            it('should retrieve an army list PDF', function (done) {
                const apiPath = path.join('/api', apiVersion, 'armyLists', retrievedArmyList.id, 'pdf');
                request(app)
                    .get(apiPath)
                    .set(userToken ? { 'PRIVATE-TOKEN': userToken } : {})
                    .send()
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        else {
                            const armyListPdf = res.body;
                            expect(armyListPdf).toExist();

                            done();
                        }
                    });
            });
        });

        after(async function() {
            await database.closeConnection();
        });
    });
});

