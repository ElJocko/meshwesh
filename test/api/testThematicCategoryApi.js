'use strict';

const path = require('path');
const request = require('supertest');
const expect = require('expect');

const serverUrl = process.env.SERVER_URL || "";
const apiVersion = 'v1';

const credentials = {
    emailAddress: process.env.ADMIN_ROLE_EMAIL || "",
    password: process.env.ADMIN_ROLE_PASSWORD || ""
};

let adminUserToken = "";

let retrievedThematicCategory = null;

const newThematicCategory = {
    name: 'Mongol Sky'
};
let newThematicCategoryId = null;

const invalidThematicCategory = {
    themeName: 'Mongol Sky'
};

const updateName = 'Mongol Thunder';

const badId = 'FFFFFFFFFFFFFFFFFFFFFFFF';

describe('ThematicCategory API', function() {
    before(function (done) {
        // Sign in and get a token
        const apiPath = path.join('/api', apiVersion, '/userCredentials');
        request(serverUrl)
            .post(apiPath)
            .send(credentials)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                else {
                    adminUserToken = res.body.token;

                    done(err);
                }
            });
    });

    describe('retrieve the list of thematic categories', function () {
        it('should retrieve all of the thematic categories', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories');
            request(serverUrl)
                .get(apiPath)
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
                        expect(thematicCategories.length === 6);

                        // Save the first category for later tests
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
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', badId);
            request(serverUrl)
                .get(apiPath)
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

        it('should retrieve a thematic category as admin user', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
            request(serverUrl)
                .get(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
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

        it('should retrieve army lists as admin user', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id, '/armyLists');
            request(serverUrl)
                .get(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
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
        it('should not create a thematic category with invalid data', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories');
            request(serverUrl)
                .post(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
                .send(invalidThematicCategory)
                .expect(400)
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

        it('should create a thematic category', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories');
            request(serverUrl)
                .post(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
                .send(newThematicCategory)
                .expect(201)
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

        it('should find the new thematic category', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', newThematicCategoryId);
            request(serverUrl)
                .get(apiPath)
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
    });

    describe('update thematic category', function () {
        it('should update a thematic category', function (done) {
            newThematicCategory.name = updateName;
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', newThematicCategoryId);
            request(serverUrl)
                .put(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
                .send(newThematicCategory)
                .expect(200)
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

        it('should not update a thematic category with invalid data', function (done) {
            newThematicCategory.name = updateName;
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', newThematicCategoryId);
            request(serverUrl)
                .put(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
                .send(invalidThematicCategory)
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

        it('should find the updated thematic category', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', newThematicCategoryId);
            request(serverUrl)
                .get(apiPath)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        expect(res.body.name).toBe(updateName);
                        done();
                    }
                });
        });
    });

    describe('delete thematic category', function () {
        it('should delete a thematic category', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
            request(serverUrl)
                .del(apiPath)
                .set('PRIVATE-TOKEN', adminUserToken)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    else {
                        done();
                    }
                });
        });

        it('should not find the deleted thematic category', function (done) {
            const apiPath = path.join('/api', apiVersion, 'thematicCategories', retrievedThematicCategory.id);
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

