'use strict';

var enemyXrefService = require('../services/enemyXrefService');
var logger = require('../lib/logger');
var _ = require('lodash');

exports.import = function(req, res) {
    // Get the data from the request
    var enemyXrefImportRequest = req.body;

    // Create the troop type
    enemyXrefService.import(enemyXrefImportRequest, function(err, importSummary) {
        if (err) {
            if (err.message === enemyXrefService.errors.duplicateCode) {
                logger.warn("Duplicate code");
                return res.status(409).send('Duplicate code');
            }
            else if (err.message === enemyXrefService.errors.validationError) {
                logger.warn('Troop type failed validation');
                return res.status(400).send('Unable to import Enemy Xrefs. Enemy Xref validation failed.');
            }
            else {
                logger.error("Failed with error: " + err);
                return res.status(500).send("Unable to import Enemy Xrefs. Server error.");
            }
        }
        else {
            logger.info("Import Enemy Xrefs: Imported = " + importSummary.imported + ", Failed = " + importSummary.failed);
            return res.status(201).send(importSummary);
        }
    });
};