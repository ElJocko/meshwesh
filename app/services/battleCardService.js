'use strict';

const BattleCard = require('../models/battleCardModel');
const async = require('async');
const _ = require('lodash');
const markd = require('marked');
const fs = require('fs');

const errors = {
    missingParameter: 'Missing required parameter',
    badlyFormattedParameter: 'Badly formatted parameter',
    duplicateCode: 'Duplicate code',
    notFound: 'Document not found',
    validationError: 'BattleCard validation failed'
};
exports.errors = errors;

markd.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false
});
function addHtmlText(battleCard) {
    if (battleCard.mdText) {
        battleCard.htmlText = markd(battleCard.mdText);
    }
}

exports.retrieveByQuery = function(query, callback) {
    BattleCard.find(query, function(err, documents) {
        if (err) {
            return callback(err);
        }
        else {
            const objects = [];
            for (let i = 0; i < documents.length; ++i) {
                const object = documents[i].toObject();
                addHtmlText(object);
                objects.push(object);
            }
            return callback(null, objects);
        }
    });
};

exports.retrieveById = function(id, callback) {
    if (id) {
        BattleCard.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
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
                    const object = document.toObject();
                    addHtmlText(object);
                    return callback(null, object);
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.create = function(data, callback) {
    // Create the document
    const document = new BattleCard(data);

    // Save the document in the database
    document.save(function(err, savedDocument) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // 11000 = Duplicate index
                const error = new Error(errors.duplicateCode);
                return callback(error);
            }
            else {
                return callback(err);
            }
        }
        else {
            return callback(null, savedDocument.toObject());
        }
    });
};

exports.update = function(id, data, callback) {
    if (id) {
        BattleCard.findById(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
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
                            const error = new Error(errors.duplicateCode);
                            return callback(error);
                        }
                        else {
                            return callback(err);
                        }
                    }
                    else {
                        return callback(null, savedDocument.toObject());
                    }
                });
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.deleteById = function(id, callback) {
    if (id) {
        BattleCard.findByIdAndRemove(id, function(err, document) {
            if (err) {
                if (err.name === 'CastError') {
                    const error = new Error(errors.badlyFormattedParameter);
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
                    return callback(null, document.toObject());
                }
                else {
                    return callback();
                }
            }
        });
    }
    else {
        const error = new Error(errors.missingParameter);
        error.parameterName = 'id';
        return callback(error);
    }
};

exports.import = function(importRequest, callback) {
    // Delete the existing documents
    BattleCard.remove({}, function(error) {
        // Import the documents
        async.mapSeries(
            importRequest.data,
            importBattleCard,
            function(err, results) {
                if (err) {
                    // TBD: organize results better
                    return callback(err);
                }
                else {
                    const importSummary = summarizeImport(results);
                    return callback(null, importSummary);
                }
            }
        );
    });

    function importBattleCard(battleCardData, cb) {
        // Get the battle card text
        const path = './standardImportData/battleCards/' + battleCardData.permanentCode + '.md';
        fs.readFile(path, 'utf-8', function(err, data) {
            battleCardData.mdText = data;

            // Save the document in the database
            const document = new BattleCard(battleCardData);
            document.save(function(err, savedDocument) {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // 11000 = Duplicate index
                        const error = new Error(errors.duplicateCode);
                        return cb(null, { battleCard: null, error: error });
                    }
                    else {
                        return cb(null, { battleCard: null, error: err });
                    }
                }
                else {
                    return cb(null, { battleCard: savedDocument.toObject(), error: null });
                }
            });
        });
    }

    function summarizeImport(results) {
        let importCount = 0;
        let errorCount = 0;
        results.forEach(function(item) {
            if (item.battleCard) {
                importCount = importCount + 1;
            }
            else if (item.error) {
                errorCount = errorCount + 1;
            }
            else {
                // shouldn't reach here
            }
        });
        const summary = { imported: importCount, failed: errorCount };
        return summary;
    }
};

