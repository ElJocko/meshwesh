'use strict';

var LogMessage = require('../models/logMessageModel');

exports.create = function(data, callback) {
    // Create the document
    var document = new LogMessage(data);

    // Save the document in the database
    document.save(function(err, savedDocument) {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, savedDocument.toObject());
        }
    });
};
