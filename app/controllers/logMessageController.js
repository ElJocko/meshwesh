'use strict';

var logMessageService = require('../services/logMessageService');
var logger = require('../lib/logger');
var _ = require('lodash');

exports.create = function(req, res) {
    // Get the data from the request
    var logMessageData = req.body;
    logMessageData.timestamp = Date.now();
    logMessageData.ipAddress = req.ip;

    // Create the troop type
    logMessageService.create(logMessageData, function(err, document) {
        if (err) {
            logger.error("Failed with error: " + err);
            return res.status(500).send("Unable to create Log Message. Server error.");
        }
        else {
            logger.info("Success: Created Log Message: " + document.message);
            return res.status(201).send(document);
        }
    });
};