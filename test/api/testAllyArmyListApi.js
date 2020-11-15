'use strict';

// Load environment variables
const dotenv = require('dotenv');
dotenv.load({ path: './test/config/local-test.env' });

const userService = require('../../app/services/userService');

const database = require('../../app/lib/database-in-memory')

var path = require('path');
var request = require('supertest');
var expect = require('expect');
const assert = require('assert');

var apiVersion = 'v1';

var adminRoleCredentials = {
    emailAddress: process.env.ADMIN_ROLE_EMAIL || "",
    password: process.env.ADMIN_ROLE_PASSWORD || ""
};

var adminRoleAuthHeader = "";

var allyArmyList = null;
var allyArmyListData = {
    name: 'Test Ally Army List',
    listId: 100,
    sublistId: 'z',
    troopOptions: [
        {
            min: 1,
            max: 3,
            dateRange: { startDate: 500, endDate: 600 },
            troopEntries: [
                { troopTypeCode: 'Rd' }
            ],
            description: 'This is a test of the ally army system.'
        }
    ]
};

describe('AllyArmyList API', function() {
    let app;
    before(async function() {
        // Establish the database connection
        // Use an in-memory database that we spin up for the test
        await database.initializeConnection();

        // Create the app
        app = await require('../../app').initializeApp();
    });

    before(function (done) {
        // Add the admin user to the database
        if (adminRoleCredentials) {
            const testUser = {
                role: 'admin',
                emailAddress: adminRoleCredentials.emailAddress,
                password: adminRoleCredentials.password
            }
            userService.create(testUser, function (err, user) {
                assert.ifError(err);
                done();
            });
        }
        else {
            done();
        }
    });

    // Get the auth token for the admin user
    before(function(done) {
        var apiPath = path.join('/api', apiVersion, 'userCredentials');
        request(app)
            .post(apiPath)
            .send(adminRoleCredentials)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                else {
                    var token = res.body.token;
                    adminRoleAuthHeader = token;
                    done();
                }
            });
    });

    describe('retrieve all', function () {
        it('should retrieve an array of ally army lists', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists');
            request(app)
                .get(apiPath)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var retrievedAllyArmyLists = res.body;
                        expect(retrievedAllyArmyLists).toExist();
                        expect(Array.isArray(retrievedAllyArmyLists)).toBeTruthy();

                        done();
                    }
                });
        });
    });

    describe('create ally army list without credentials', function () {
        it('should not create an ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists');
            request(app)
                .post(apiPath)
                .send(allyArmyListData)
                .expect(401)
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

    describe('create ally army list', function () {
        it('should create an ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists');
            request(app)
                .post(apiPath)
                .set('PRIVATE-TOKEN', adminRoleAuthHeader)
                .send(allyArmyListData)
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        allyArmyList = res.body;
                        expect(allyArmyList).toExist();

                        done();
                    }
                });
        });
    });

    describe('retrieve ally army list', function () {
        it('should retrieve the created ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists', allyArmyList.id);
            request(app)
                .get(apiPath)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var retrievedAllyArmyList = res.body;
                        expect(retrievedAllyArmyList).toExist();

                        done();
                    }
                });
        });
    });

    describe('delete ally army list without credentials', function () {
        it('should not delete the created ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists', allyArmyList.id);
            request(app)
                .del(apiPath)
                .expect(401)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var retrievedAllyArmyList = res.body;
                        expect(retrievedAllyArmyList).toExist();

                        done();
                    }
                });
        });
    });

    describe('delete ally army list', function () {
        it('should delete the created ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists', allyArmyList.id);
            request(app)
                .del(apiPath)
                .set('PRIVATE-TOKEN', adminRoleAuthHeader)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        var retrievedAllyArmyList = res.body;
                        expect(retrievedAllyArmyList).toExist();

                        done();
                    }
                });
        });
    });

    describe('retrieve deleted ally army list', function () {
        it('should not retrieve the deleted ally army list', function (done) {
            var apiPath = path.join('/api', apiVersion, 'allyArmyLists', allyArmyList.id);
            request(app)
                .get(apiPath)
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
    });

    after(async function() {
        await database.closeConnection();
    });
});
