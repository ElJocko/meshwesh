'use strict';

var userService = require('../services/userService');
var logger = require('../lib/logger');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.permanentCode) {
        query.permanentCode = req.query.permanentCode;
    }
    userService.retrieveByQuery(query, function(err, documents) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get Users. Server error.');
        }
        else {
            return res.status(200).send(documents);
        }
    });
};

module.exports.retrieveById = function(req, res) {
    userService.retrieveById(req.params.userId, function(err, document) {
        if (err) {
            if (err.message === userService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted id');
                return res.status(400).send('User id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to get User. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('User not found');
                return res.status(404).send('User not found.');
            }
            else {
                return res.status(200).send(document);
            }
        }
    });
};

exports.create = function(req, res) {
    // Get the data from the request
    var troopTypeData = req.body;

    // Create the troop type
    userService.create(troopTypeData, function(err, document) {
        if (err) {
            if (err.message === userService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to create User. Server error.");
            }
        }
        else {
            logger.info("Success: Created User " + document.emailAddress);
            return res.status(201).send(document);
        }
    });
};

exports.update = function(req, res) {
    // Get the data from the request
    var troopTypeData = req.body;

    userService.update(req.params.troopTypeId, troopTypeData, function(err, document) {
        if (err) {
            if (err.message === userService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted user id');
                return res.status(400).send('User id is badly formatted.');
            }
            else if (err.message === userService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to update User. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('User not found');
                return res.status(404).send('User not found.');
            }
            else {
                logger.info("Success: Updated User " + document.emailAddress);
                return res.status(200).send(document);
            }
        }
    });
};

exports.delete = function(req, res) {
    userService.deleteById(req.params.troopTypeId, function(err, document) {
        if (err) {
            if (err.message === userService.errors.badlyFormattedParameter) {
                logger.warn('Badly formatted user id');
                return res.status(400).send('User id is badly formatted.');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to delete User. Server error.');
            }
        }
        else {
            if (!document) {
                logger.warn('User not found');
                return res.status(404).send('User not found.');
            }
            else {
                logger.info("Success: Deleted User " + document.emailAddress);
                return res.status(200).send(document);
            }
        }
    });
};

exports.signIn = function(req, res) {
    var credentials = {
        emailAddress: req.body.emailAddress,
        password: req.body.password
    };
    userService.signIn(credentials, function(err, jwt) {
        if (err) {
            if (err.message === userService.errors.notFound) {
                logger.warn('Unable to sign in user: user not found');
                return res.status(401).send('Not authorized');
            }
            else if (err.message === userService.errors.incorrectPassword) {
                logger.warn('Unable to sign in user: incorrect password');
                return res.status(401).send('Not authorized');
            }
            else {
                logger.error('Failed with error: ' + err);
                return res.status(500).send('Unable to sign in user. Server error.');
            }
        }
        else {
            if (jwt) {
                logger.info('User sign in successful: ' + credentials.emailAddress);
                return res.status(200).send(jwt);
            }
            else {
                // ??
            }
        }
    });
};


