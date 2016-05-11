'use strict';

var User = require('../models/userModel');
var transform = require('../models/transform');
var crypto = require('crypto');

var errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateCode: 'Duplicate code',
    notFound: 'Document not found',
    validationError: 'User validation failed',
    incorrectPassword: 'Incorrect password'
};
exports.errors = errors;

exports.retrieveByQuery = function(query, callback) {
    User.find(query, function(err, documents) {
        if (err) {
            return callback(err);
        }
        else {
            var objects = [];
            for (var i = 0; i < documents.length; ++i) {
                var object = documents[i].toJSON();
                transform.sanitizeUser(object);
                objects.push(object);
            }
            return callback(null, objects);
        }
    });
};

exports.retrieveById = function(id, callback) {
    if (id) {
        User.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                // Note: document is null if not found
                if (document) {
                    var flatDocument = document.toJSON();
                    transform.sanitizeUser(flatDocument);
                    return callback(null, flatDocument);
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.create = function(data, callback) {

    // Generate the salt
    data.salt = crypto.randomBytes(40).toString('base64');

    // Generate the hash of the password and salt
    crypto.pbkdf2(data.password, data.salt, 1000, 512, 'sha512', function(err, key) {
        if (err) {
            return callback(err);
        }
        else {
            data.passwordHash = key.toString('hex');

            // Create the document
            var document = new User(data);

            // Save the document in the database
            document.save(function(err, savedDocument) {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // 11000 = Duplicate index
                        var error = new Error(errors.duplicateCode);
                        return callback(error);
                    }
                    else {
                        return callback(err);
                    }
                }
                else {
                    var flatDocument = savedDocument.toJSON();
                    transform.sanitizeUser(flatDocument);
                    return callback(null, flatDocument);
                }
            });
        }
    });
};

exports.update = function(id, data, callback) {
    if (id) {
        User.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else if (!document) {
                // document not found
                return callback(null);
            }
            else {
                // Copy data to found document and save
                _.assign(document, data);
                document.save(function(err, savedDocument) {
                    if (err) {
                        if (err.name === 'MongoError' && err.code === 11000) {
                            // 11000 = Duplicate index
                            var error = new Error(errors.duplicateCode);
                            return callback(error);
                        }
                        else {
                            return callback(err);
                        }
                    }
                    else {
                        return callback(null, savedDocument.toJSON());
                    }
                });
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.deleteById = function(id, callback) {
    if (id) {
        User.findByIdAndRemove(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    var error = new Error(errors.badlyFormattedParameter);
                    error.parameterName = 'id';
                    return callback(error);
                }
                else {
                    return callback(err);
                }
            }
            else {
                //Note: document is null if not found
                if (document) {
                    return callback(null, document.toJSON());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        var error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.signIn = function(credentials, callback) {
    // Find the user
    var query = { emailAddress: credentials.emailAddress };
    User.findOne(query, function(err, document) {
        if (err) {
            return callback(err);
        }
        else if (!document) {
            var error = new Error(errors.notFound);
            return callback(error);
        }
        else {
            // Calculate the hash of the provided password and user's salt
            crypto.pbkdf2(credentials.password, document.salt, 1000, 512, 'sha512', function(err, key) {
                if (err) {
                    return callback(err);
                }
                else {
                    // Check for a match with the stored hash (passwordHash)
                    var hash = key.toString('hex');
                    if (hash === document.passwordHash) {
                        var jwt = {};
                        return callback(null, jwt);
                    }
                    else {
                        var error = new Error(errors.incorrectPassword);
                        return callback(error);
                    }
                }
            });
        }
    });
};



