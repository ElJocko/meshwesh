'use strict';

var path = require('path');
var request = require('supertest');
var expect = require('expect');

var serverUrl = process.env.SERVER_URL || "";
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

    // Get the auth token for the admin user
    before(function(done) {
        var apiPath = path.join('/api', apiVersion, 'userCredentials');
        request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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
            request(serverUrl)
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

});
