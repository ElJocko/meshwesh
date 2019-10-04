'use strict';

const thematicCategoryService = require('./thematicCategoryService');
const ArmyList = require('../models/armyListModel');
const AllyArmyList = require('../models/allyArmyListModel');
const ThematicCategory = require('../models/thematicCategoryModel');
const EnemyXref = require('../models/enemyXrefModel');
const ThematicCategoryToArmyListXref = require('../models/thematicCategoryToArmyListXrefModel');
const TroopType = require('../models/troopTypeModel');
const transform = require('../models/lib/transform');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const PdfPrinter = require('pdfmake');

// Initialize troop types
const troopTypes = {};
TroopType.find().lean().exec(function(err, retrievedTroopTypes) {
    if (err) {

    }
    else {
        retrievedTroopTypes.forEach(function(troopType) {
            troopTypes[troopType.permanentCode] = {
                displayName: troopType.displayName,
                cost: troopType.cost,
                combatFactors: troopType.combatFactors
            };
        })
    }
});

function troopTypeCodeValid(code) {
    return troopTypes[code];
}

function displayName(code, note) {
    if (note) {
        return troopTypes[code].displayName + ' [' + note + ']';
    }
    else {
        return troopTypes[code].displayName
    }
}

function cost(code) {
    return troopTypes[code].cost + ' points';
}

function battleLine(core) {
    if (core === 'all') {
        return 'all';
    }
    else {
        return '-';
    }
}

function shooting(code) {
    const factor = troopTypes[code].combatFactors.rangedCombat.shooting;
    if (factor == 0) {
        return '-';
    }
    else {
        return '+' + factor;
    }
}

function shotAt(code) {
    return '+' + troopTypes[code].combatFactors.rangedCombat.shotAt;
}

function vsFoot(code) {
    return '+' + troopTypes[code].combatFactors.closeCombat.vsFoot;
}

function vsMounted(code) {
    return '+' + troopTypes[code].combatFactors.closeCombat.vsMounted;
}

function makeCell(options, text) {
    const cell = {
        border: options.border,
        text: text,
        position: options.position
    };

    return cell;
}

exports.retrieveArmyListPdf = function(id, callback) {
    if (id) {
        ArmyList.findById(id).lean().exec(function(err, leanDoc) {
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
                // Note: object is null if not found
                if (leanDoc) {
                    transform.removeDatabaseArtifactsFromObject(leanDoc);

                    const fonts = {
                        Roboto: {
                            normal: 'fonts/Roboto/Roboto-Regular.ttf',
                            bold: 'fonts/Roboto/Roboto-Medium.ttf',
                            italics: 'fonts/Roboto/Roboto-Italic.ttf',
                            bolditalics: 'fonts/Roboto/Roboto-MediumItalic.ttf'
                        }
                    };

                    const title = { text: leanDoc.derivedData.extendedName, fontSize: 32 };
                    const invasion = { text: 'Invasion: ' + leanDoc.invasionRatings[0].value };
                    const maneuver = { text: 'Maneuver: ' + leanDoc.maneuverRatings[0].value };

                    const troopOptionsHeader = { text: 'Required Troops', fontSize: 16, margin: [0, 15, 0, 5] };

                    const troopOptions = {
                        layout: {
                            hLineWidth: function (i, node) {
                                if (i === 0 || i === node.table.body.length) {
                                    return 0;
                                }
                                return (i === node.table.headerRows) ? 2 : 1;
                            },
                            vLineWidth: function (i) {
                                return 0;
                            },
                            hLineColor: function (i) {
                                return i === 1 ? 'black' : '#aaa';
                            },
                            paddingLeft: function (i) {
                                return i === 0 ? 0 : 8;
                            },
                            paddingRight: function (i, node) {
                                return (i === node.table.widths.length - 1) ? 0 : 8;
                            },
                            paddingTop: function (i, node) {
                                const row = node.table.body[i];
                                if (row[0].position) {
                                    if (row[0].position.top) {
                                        return 6;
                                    }
                                    else {
                                        return 0;
                                    }
                                }
                                else {
                                    return 2;
                                }
                            },
                            paddingBottom: function (i, node) {
                                const row = node.table.body[i];
                                if (row[0].position) {
                                    if (row[0].position.bottom) {
                                        return 6;
                                    }
                                    else {
                                        return 0;
                                    }
                                }
                                else {
                                    return 2;
                                }
                            }
                        },
                        table: {
                            layout: {

                            },
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto', '15%', '10%', 'auto', 'auto', 'auto', 'auto', '12%'],

                            body: [
                                ['Description', 'Min', 'Max', 'Battle Line', 'Allowed Troop Types', 'Cost per Stand', 'sht', 'tgt', 'vFt', 'vMt', 'Restrictions']
                            ]
                        }
                    };
                    leanDoc.troopOptions.forEach(function(option) {
                        let firstRow = true;
                        let lastRow = false;

                        for (let i = 0; i < option.troopEntries.length; ++i) {
                            const entry = option.troopEntries[i];

                            if (!troopTypeCodeValid(entry.troopTypeCode)) {
                                console.warn(`Unable to process troop entry, troop type code ${ entry.troopTypeCode } not found.`);
                                continue;
                            }

                            if (i === option.troopEntries.length - 1) {
                                lastRow = true;
                            }
                            const cellOptions = {
                                border: [false, firstRow, false, lastRow],
                                position: {
                                    top: firstRow,
                                    bottom: lastRow
                                }
                            };

                            if (firstRow) {
                                troopOptions.table.body.push([
                                    makeCell(cellOptions, option.description),
                                    makeCell(cellOptions, option.min),
                                    makeCell(cellOptions, option.max),
                                    makeCell(cellOptions, battleLine(option.core)),
                                    makeCell(cellOptions, displayName(entry.troopTypeCode, entry.note)),
                                    makeCell(cellOptions, cost(entry.troopTypeCode)),
                                    makeCell(cellOptions, shooting(entry.troopTypeCode)),
                                    makeCell(cellOptions, shotAt(entry.troopTypeCode)),
                                    makeCell(cellOptions, vsFoot(entry.troopTypeCode)),
                                    makeCell(cellOptions, vsMounted(entry.troopTypeCode)),
                                    makeCell(cellOptions, option.note)
                                ]);
                                firstRow = false;
                            }
                            else {
                                troopOptions.table.body.push([
                                    makeCell(cellOptions, ''),
                                    makeCell(cellOptions, ''),
                                    makeCell(cellOptions, ''),
                                    makeCell(cellOptions, ''),
                                    makeCell(cellOptions, displayName(entry.troopTypeCode, entry.note)),
                                    makeCell(cellOptions, cost(entry.troopTypeCode)),
                                    makeCell(cellOptions, shooting(entry.troopTypeCode)),
                                    makeCell(cellOptions, shotAt(entry.troopTypeCode)),
                                    makeCell(cellOptions, vsFoot(entry.troopTypeCode)),
                                    makeCell(cellOptions, vsMounted(entry.troopTypeCode)),
                                    makeCell(cellOptions, '')
                                ]);
                            }
                        }
                    });

                    const docDefinition = {
                        pageOrientation: 'landscape',
                        content: [
                            title,
                            invasion,
                            maneuver,
                            troopOptionsHeader,
                            troopOptions
                        ]};
                    const printer = new PdfPrinter(fonts);
                    const pdfKitDoc = printer.createPdfKitDocument(docDefinition);

                    return callback(null, leanDoc, pdfKitDoc);
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
