'use strict';

const Papa = require('../../../node_modules/papaparse/papaparse');
const async = require ('../../../node_modules/async/dist/async');

angular
    .module('meshweshControllers')
    .controller('TroopOptionsImportController', TroopOptionsImportController);

TroopOptionsImportController.$inject = ['$location', '$scope', '$interval', 'AllyArmyListImportService', 'TroopTypeService', 'BattleCardService', 'TroopOptionsImportService'];

function TroopOptionsImportController($location, $scope, $interval, AllyArmyListImportService, TroopTypeService, BattleCardService, TroopOptionsImportService) {
    var vm = this;

    vm.file = null;
    vm.parsedData = [];
    vm.statusMessage1 = 'No file selected';
    vm.statusMessage2 = '';

    vm.importProgress = {
        running: false,
        numberTotal: 0,
        numberDone: 0
    };

    var troopTypes = {};
    initializeTroopTypeData();

    var battleCards = {};
    initializeBattleCardData();

    vm.importData = importData;

    document.getElementById('inputFileInput').addEventListener('change', onFileSelected, false);

    function onFileSelected(event) {
        vm.file = event.target.files[0];
        parseFile();
    }

    function parseFile() {
        Papa.parse(
            vm.file,
            {
                delimiter: ',',
                header: true,
                complete: function(results) {
                    //console.log(results);
                    vm.statusMessage1 = '';
                    vm.statusMessage2 = '';
                    vm.parsedData = [];
                    vm.allyArmyListArray = [];

                    if (results.data) {
                        console.log('Read ' + results.data.length + ' rows from file.');
                        // Convert the data to a flat array of troop options
                        var troopOptionsArray = [];
                        var allyTroopOptionsArray = [];
                        var armyListArray = [];
                        var allyOptionsArray = [];
                        var armyBattleCardsArray = [];
                        var errorRows = 0;

                        var lastArmyName;

                        results.data.forEach(function(item) {
                            // Determine the category for each row
                            if (item.general && item.general.length > 0) {
                                // This row has army list information

                                // Save this for error messages
                                lastArmyName = item.armyName;

                                // Initialize the army list
                                var armyListData = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    keywords: [],
                                    troopEntriesForGeneral: [],
                                    status: item.description,
                                    showTroopOptionDescriptions: false
                                };

                                // Initialize the ally army list
                                var allyArmyListData = {
                                    name: null,
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    dateRange: null,
                                    troopOptions: [],
                                    internalContingent: false
                                };

                                // Parse Troop Entries for the General
                                armyListData.troopEntriesForGeneral = parseGeneral(item);

                                if (armyListData.troopEntriesForGeneral.length === 0) {
                                    console.log('No general found: ' + item.general + ' in list ' + item.listId + '/' + item.sublistId );
                                }

                                // Parse the army battle cards I
                                armyListData.battleCardEntries = parseBattleCards(item.armyBattleCards, item.armyName);

                                // Status defaults to 'Draft'
                                if (!armyListData.status) {
                                    armyListData.status = 'Draft';
                                }

                                // Show troop option descriptions?
                                if (item.troopEntries && item.troopEntries.trim().toUpperCase() === 'S') {
                                    armyListData.showTroopOptionDescriptions = true;
                                }

                                // Keywords
                                var keywords = item.ally1Name.trim();
                                if (keywords && keywords.length > 0) {
                                    armyListData.keywords = keywords.split(' ');
                                }

                                // Save the army list and ally army list data
                                armyListArray.push(armyListData);
                                vm.allyArmyListArray.push(allyArmyListData);
                            }
                            else if (item.armyName === 'Battle Cards' && !item.troopOptionOrder) {
                                // This row has an army battle card II
                                const battleCardRange = item.minMax;
                                const battleCardName = item.troopEntries;
                                const battleCardDescription = item.description;

                                const battleCardEntry = {
                                    battleCardCode: lookupBattleCardCode(battleCardName),
                                    note: battleCardDescription,
                                    listId: item.listId,
                                    sublistId: item.sublistId
                                };

                                // Convert minMax
                                if (item.minMax) {
                                    var battleCardMinMaxValues = item.minMax.split('-');
                                    if (battleCardMinMaxValues.length === 1) {
                                        battleCardEntry.min = battleCardMinMaxValues[0];
                                        battleCardEntry.max = battleCardMinMaxValues[0];
                                    }
                                    else if (battleCardMinMaxValues.length === 2) {
                                        battleCardEntry.min = battleCardMinMaxValues[0];
                                        battleCardEntry.max = battleCardMinMaxValues[1];
                                    }
                                }

                                if (battleCardEntry.battleCardCode) {
                                    armyBattleCardsArray.push(battleCardEntry);
                                }
                                else {
                                    console.log(`Did not find battle card (II) for ${ battleCardName } in ${ lastArmyName }`);
                                }
                            }
                            else if (item.armyName && isInternalAlly(item.sublistId) && !item.troopOptionOrder) {
                                // This row has an internal ally
                                var allyArmyListData = {
                                    name: item.armyName,
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    dateRange: makeDateRange(item.startDate, item.endDate),
                                    troopOptions: [],
                                    internalContingent: false
                                };

                                // Check the Contingent Flag
                                if (item.description === 'Separate Contingent') {
                                    allyArmyListData.internalContingent = true;
                                }
                                else if (item.description === 'Ally') {
                                    // ok
                                }
                                else {
                                    console.log('Internal ally found with unexpected contingent flag: ' + item.description + ' (' + item.listId + '/' + item.sublistId + ')');
                                }

                                vm.allyArmyListArray.push(allyArmyListData);
                            }
                            else if (item.troopOptionOrder && item.troopOptionOrder !== '0') {
                                // This row is a troop option
                                var internalAlly = false;
                                if (item.sublistId === 'w' || item.sublistId === 'x' || item.sublistId === 'y' || item.sublistId === 'z') {
                                    internalAlly = true;
                                }

                                // This row has troop option information
                                var troopOption = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    min: 0,
                                    max: 0,
                                    dateRange: makeDateRange(item.startDate, item.endDate),
                                    troopEntries: [],
                                    description: item.description,
                                    note: '',
                                    core: '',
                                    battleCardEntries: []
                                };

                                var allyTroopOption = {
                                    listId: item.listId,
                                    sublistId: item.sublistId,
                                    min: 0,
                                    max: 0,
                                    dateRange: makeDateRange(item.startDate, item.endDate),
                                    troopEntries: [],
                                    description: item.description,
                                    note: '',
                                    core: ''
                                };

                                // Extract a note from the description
                                if (item.description.length > 0 && item.description.charAt(0) === '(') {
                                    var end = item.description.indexOf(')');
                                    if (end === -1) {
                                        console.log('Could not parse description, no end of note delimiter found:' + item.description);
                                    }
                                    else {
                                        troopOption.note = item.description.slice(1, end).trim();
                                        troopOption.description = item.description.slice(end + 1).trim();

                                        allyTroopOption.note = troopOption.note;
                                        allyTroopOption.description = troopOption.description;
                                    }
                                }

                                // Convert minMax
                                if (item.minMax) {
                                    var minMaxValues = item.minMax.split('-');
                                    if (minMaxValues.length === 1) {
                                        troopOption.min = minMaxValues[0];
                                        troopOption.max = minMaxValues[0];
                                    }
                                    else if (minMaxValues.length === 2) {
                                        troopOption.min = minMaxValues[0];
                                        troopOption.max = minMaxValues[1];
                                    }
                                }

                                // Convert allyMinMax
                                if (item.allyMinMax) {
                                    var allyMinMaxValues = item.allyMinMax.split('-');
                                    if (allyMinMaxValues.length === 1) {
                                        allyTroopOption.min = allyMinMaxValues[0];
                                        allyTroopOption.max = allyMinMaxValues[0];
                                    }
                                    else if (allyMinMaxValues.length === 2) {
                                        allyTroopOption.min = allyMinMaxValues[0];
                                        allyTroopOption.max = allyMinMaxValues[1];
                                    }
                                }

                                // Convert troop types
                                var textTroopEntries = item.troopEntries.split(' or ');
                                var conversionResults = _.map(textTroopEntries, convertTextToTroopEntry);
                                conversionResults.forEach(function(result) {
                                    // Issue warnings for unknown names
                                    if (result.troopEntry.troopTypeCode === null) {
                                        console.warn('Did not find troop type for ' + result.mainText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    if (result.dismountText && result.troopEntry.dismountTypeCode === null) {
                                        console.warn('Did not find troop type for dismount entry ' + result.dismountText + ' (' + troopOption.listId + '/' + troopOption.sublistId + '/' + item.troopOptionOrder + ')');
                                    }

                                    // Save the troop entry
                                    if (result.troopEntry.troopTypeCode) {
                                        troopOption.troopEntries.push(result.troopEntry);
                                        allyTroopOption.troopEntries.push(result.troopEntry);
                                    }
                                });

                                // Check for core
                                if (item.core.toLowerCase() === 'core') {
                                    troopOption.core = 'all';
                                    allyTroopOption.core = 'all';
                                }
                                else if (item.core.toLowerCase() === 'half core') {
                                    troopOption.core = 'half';
                                    allyTroopOption.core = 'half';
                                }
                                else if (item.core.length > 0) {
                                    console.warn('Core contained unexpected text: ' + item.core);
                                }

                                // Check for troop option battle cards
                                if (item.armyBattleCards) {
                                    troopOption.battleCardEntries = parseBattleCards(item.armyBattleCards, lastArmyName, ';,');
                                }

                                // If the troop option is valid, add it to the parsed data
                                if (troopOption.max > 0 && troopOption.troopEntries.length > 0) {
                                    troopOptionsArray.push(troopOption);
                                }
                                else if (!internalAlly) {
                                    var itemString = JSON.stringify(item);
                                    console.log('Unable to convert item: ' + itemString);

                                    errorRows = errorRows + 1;
                                }

                                // If the ally troop options is valid, add it to the parsed data
                                if (allyTroopOption.max > 0 && allyTroopOption.troopEntries.length > 0) {
                                    allyTroopOptionsArray.push(allyTroopOption);
                                }
                            }
                            else if (item.allyId && item.allyId !== 0 && item.allyId !== '0') {
                                // This row has ally information
                                var tempAllyOptions = [];
                                var allyOptions = [];

                                // First entry (or entries)
                                if (item.ally1Name && item.ally1Name.trim().length > 0) {
                                    if (item.ally1Id) {
                                        item.ally1Id = item.ally1Id.trim();
                                    }
                                    var allyIds = item.ally1Id.split(' ');
                                    allyIds.forEach(function(allyId) {
                                        allyId = allyId.trim();
                                        var allyListId = allyId.slice(0, allyId.length - 1);
                                        var allySublistId = allyId.slice(allyId.length - 1);

                                        var allyEntry = {
                                            name: item.ally1Name,
                                            allyListId: allyListId,
                                            allySublistId: allySublistId
                                        };

                                        var allyOption = {
                                            listId: item.listId,
                                            sublistId: item.sublistId,
                                            dateRange: makeDateRange(item.startDate, item.endDate),
                                            note: null,
                                            allyEntries: [ allyEntry ]
                                        };

                                        tempAllyOptions.push(allyOption);
                                    });
                                }

                                // Second entry (or entries)
                                if (item.ally2Name && item.ally2Name.trim().length > 0) {
                                    if (item.ally2Id) {
                                        item.ally2Id = item.ally2Id.trim();
                                    }
                                    allyIds = item.ally2Id.split(' ');
                                    allyIds.forEach(function(allyId) {
                                        allyId = allyId.trim();
                                        var allyListId = allyId.slice(0, allyId.length - 1);
                                        var allySublistId = allyId.slice(allyId.length - 1);

                                        var allyEntry = {
                                            name: item.ally2Name,
                                            allyListId: allyListId,
                                            allySublistId: allySublistId
                                        };

                                        // For each option created from the first entry, copy the option and add the new entry
                                        tempAllyOptions.forEach(function (tempOption) {
                                            var newAllyOption = _.cloneDeep(tempOption);
                                            newAllyOption.allyEntries.push(allyEntry);
                                            allyOptions.push(newAllyOption);
                                        });
                                    });
                                }
                                else {
                                    // Not copied while parsing second entry, copy now
                                    allyOptions = tempAllyOptions;
                                }

                                allyOptions.forEach(function(allyOption) {
/*
                                    var text = 'Ally option found. Army list: ' + allyOption.armyListId + allyOption.armyListSublistId;
                                    if (allyOption.dateRange) {
                                        text = text + ' [' + allyOption.dateRange.startDate + ' to ' + allyOption.dateRange.endDate + ']';
                                    }
                                    text = text + ' with Allies: ';
                                    allyOption.allyEntries.forEach(function(allyEntry, index) {
                                        if (index > 0) {
                                            text = text + ' AND '
                                        }
                                        text = text + allyEntry.name + ' (' + allyEntry.allyListId + allyEntry.allySublistId + ')';
                                    });

                                    console.log(text);
*/

                                    allyOptionsArray.push(allyOption);
                                });
                            }
                        });

                        console.log('Converted ' + armyListArray.length + ' army rows.');
                        console.log('Converted ' + troopOptionsArray.length + ' troop option rows.');
                        console.log('Unable to convert ' + errorRows + ' troop option rows.');
                        console.log('Converted ' + allyTroopOptionsArray.length + ' ally troop option rows.');
                        console.log('Found ' + allyOptionsArray.length + ' ally options.');
                        console.log('Found ' + vm.allyArmyListArray.length + ' ally army lists.');
                        console.log('Found ' + armyBattleCardsArray.length + ' army battle cards II rows.');

                        // Convert the flat array of troop options into an array of army lists with troop options

                        // First, convert the data from the army list rows
                        vm.parsedData = [];
                        armyListArray.forEach(function(armyList) {
                            if (armyList.sublistId === 'z') {
                                console.log('*** internal ally ***');
                                console.log(JSON.stringify(armyList));
                            }
                            armyList.troopOptions = [];
                            armyList.allyOptions = [];
                            vm.parsedData.push(armyList);
                        });

                        // Second, copy the troop option data to the matching army list
                        troopOptionsArray.forEach(function(troopOption) {
                            // Terribly inefficient
                            var armyListFound = false;
                            vm.parsedData.forEach(function(armyList) {
                                if (armyList.listId === troopOption.listId && armyList.sublistId === troopOption.sublistId) {
                                    armyList.troopOptions.push(troopOption);
                                    armyListFound = true;
                                }
                            });

                            if (!armyListFound) {
                                // Not found, create a new army list object
                                var armyList = {
                                    listId: troopOption.listId,
                                    sublistId: troopOption.sublistId,
                                    troopOptions: [],
                                    allyOptions: [],
                                    troopEntriesForGeneral: [],
                                    status: 'Unknown'
                                };

                                if (armyList.sublistId === 'z') {
                                    console.log('*** internal ally ***');
                                    console.log(JSON.stringify(armyList));
                                    console.log(JSON.stringify(troopOption));
                                }

                                armyList.troopOptions.push(troopOption);
                                vm.parsedData.push(armyList);
                            }
                        });

                        // Third, copy the ally option data to the matching army list
                        allyOptionsArray.forEach(function(allyOption) {
                            // Terribly inefficient
                            var armyListFound = false;
                            vm.parsedData.forEach(function(armyList) {
                                if (armyList.listId === allyOption.listId && armyList.sublistId === allyOption.sublistId) {
                                    armyList.allyOptions.push(allyOption);
                                    armyListFound = true;
                                }
                            });

                            if (!armyListFound) {
                                console.log('Unable to find army list for ally option ' + allyOption.listId + '/' + allyOption.sublistId);

                            }
                        });

                        // Fourth, copy the ally troop option data to the matching ally army list
                        allyTroopOptionsArray.forEach(function(troopOption) {
                            // Terribly inefficient
                            var allyArmyListFound = false;
                            vm.allyArmyListArray.forEach(function(allyArmyList) {
                                if (allyArmyList.listId === troopOption.listId && allyArmyList.sublistId === troopOption.sublistId) {
                                    allyArmyList.troopOptions.push(troopOption);
                                    allyArmyListFound = true;
                                }
                            });

                            if (!allyArmyListFound) {
                                // Corresponding ally army list not found, ignore the troop option
                                console.log('Unable to find ally army list for troop option ' + troopOption.listId + '/' + troopOption.sublistId);
                            }
                        });

                        // Fifth, copy the army battle cards II to the matching army list
                        armyBattleCardsArray.forEach(function(battleCardEntry) {
                            var armyListFound = false;
                            vm.parsedData.forEach(function(armyList) {
                                if (armyList.listId === battleCardEntry.listId && armyList.sublistId === battleCardEntry.sublistId) {
                                    // Make sure the array exists
                                    if (!armyList.battleCardEntries) {
                                        armyList.battleCardEntries = [];
                                    }
                                    armyList.battleCardEntries.push(battleCardEntry);
                                    armyListFound = true;
                                }
                            });

                            if (!armyListFound) {
                                console.log('Unable to find army list for battle card entry ' + battleCardEntry.listId + '/' + battleCardEntry.sublistId);
                            }
                        });

                        vm.statusMessage1 = 'Found ' + troopOptionsArray.length + ' troop options in ' + vm.parsedData.length + ' army lists in the file.';
                    }
                    else {
                        vm.statusMessage1 = 'Found 0 troop options in the file.';
                    }

                    if (results.errors) {
                        vm.statusMessage2 = 'Encountered ' + results.errors.length + ' errors during parsing.';
                        results.errors.forEach(function (item) {
                            console.error(item);
                        });
                    }
                    else {
                        vm.statusMessage2 = 'No Errors encountered during parsing.';
                    }

                    $scope.$apply();
                }
            });
    }

    function parseGeneral(item) {
        // Split into groups
        var groupEntries = item.general.split('ELSE');

        // Split each group into entries
        var generalEntryList = groupEntries.reduce(splitAndAdd, []);

        // Parse the entries
        var parsedGroups = generalEntryList.map(parseGeneralGroup);

        // Issue warnings for unknown names
        parsedGroups.forEach(function(parsedGroup) {
            parsedGroup.forEach(function (result) {
                if (!result.troopTypeCode) {
                    console.log('Did not find troop type for general ' + result.troopText + ' (' + item.listId + '/' + item.sublistId + ')');
                }

                if (result.dismountText && !result.dismountTypeCode) {
                    console.log('Did not find troop type for general dismount entry ' + result.dismountText + ' (' + item.listId + '/' + item.sublistId + ')');
                }
            });
        });

        // Extract the troop entries
        var troopEntries = parsedGroups
            .map(extractTroopEntries)
            .map(removeBadTroopEntries)
            .filter(function(extractedGroup) {
                return extractedGroup.troopEntries.length;
            });

        return troopEntries;
    }

    function parseBattleCards(battleCardText, armyName, separator) {
        if (!separator) {
            separator = ',';
        }
        // Modify the text, changing separators to bars unless they are inside parentheses
        var parenFlag = false;
        var modifiedTextArray = [...battleCardText];
        var modifiedText = modifiedTextArray.reduce((acc, val) => {
            if (separator.indexOf(val) !== -1 && !parenFlag) {
                // Replace the separator with a bar
                return acc + '|';
            }
            else {
                // Set the flag
                if (val === '(' && !parenFlag) {
                    parenFlag = true;
                }
                else if (val === ')' && parenFlag) {
                    parenFlag = false;
                }

                // Copy the character
                return acc + val;
            }
        }, '');

        // Split each entry into battle card entries
        var battleCardList = modifiedText.split('|');

        // Clean and parse the entry text for each battle card
        var parsedBattleCards = battleCardList
            .map(s => s.trim())  // Trim the whitespace
            .filter(Boolean) // Remove empty strings
            .map(parseBattleCardEntryText); // And parse

        // Issue warnings for unknown names
        var warnings = [];
        parsedBattleCards.forEach(function (parsedBattleCard) {
            if (!parsedBattleCard.battleCardCode) {
                warnings.push(`Did not find battle card for ${ parsedBattleCard.battleCardText } in ${ armyName }`);
                console.log(`Original battle card text = ${ battleCardText }`);
            }
        });

        // Extract the troop entries
        var battleCardEntries = parsedBattleCards
            .map(extractBattleCardEntry)
            .filter(bc => bc.battleCardCode);

        if (warnings.length > 0) {
            for (const message of warnings) {
                console.log(message);
            }
        }

        return battleCardEntries;
    }

    function splitAndAdd(acc, entry) {
        var entries = entry.split(',');
        acc.push(entries);
        return acc;
    }

    function extractTroopEntries(parsedGroup) {
        return parsedGroup.map(extractTroopEntry);
    }

    function extractTroopEntry(parsedEntry) {
        return _.pick(parsedEntry, ['troopTypeCode', 'dismountTypeCode', 'note']);
    }

    function removeBadTroopEntries(extractedGroup) {
        return {
            troopEntries: extractedGroup.filter(function(troopEntry) {
                return troopEntry.troopTypeCode;
            })
        };
    }

    function parseGeneralGroup(entryTextGroup) {
        return entryTextGroup.map(parseGeneralEntryText);
    }

    function parseGeneralEntryText(entryText) {
//        var re = /([a-z ]*)(\(([a-z ]*)\))?/ig;
//        var reResult = re.exec(entryText.trim());

        // Format: troop//dismount (note)
        var result = {
            troopText: null,
            troopTypeCode: null,
            dismountText: null,
            dismountTypeCode: null,
            note: null
        };

        // Check for an annotation: (note)
        var startBracketIndex = entryText.indexOf('(');
        if (startBracketIndex >= 0) {
            var endBracketIndex = entryText.indexOf(')');
            if (endBracketIndex >= 0) {
                result.note = entryText
                    .slice(startBracketIndex + 1, endBracketIndex)
                    .trim();
                entryText = entryText
                    .slice(0, startBracketIndex)
                    .trim();
            }
        }

        // Extract the troop text
        result.troopText = entryText
            .trim()
            .replace(/s$/, ''); // remove trailing 's'

        // Lookup the codes
        result.troopTypeCode = lookupTypeCode(result.troopText);
        result.dismountTypeCode = lookupTypeCode(result.dismountText);

        return result;
    }

    function parseBattleCardEntryText(entryText) {
//        var re = /([a-z ]*)(\(([a-z ]*)\))?/ig;
//        var reResult = re.exec(entryText.trim());

        // Format: troop//dismount (note)
        var result = {
            min: null,
            max: null,
            battleCardText: null,
            battleCardCode: null,
            note: null
        };

        // Check for an annotation: (note)
        var startBracketIndex = entryText.indexOf('(');
        if (startBracketIndex >= 0) {
            var endBracketIndex = entryText.indexOf(')');
            if (endBracketIndex >= 0) {
                result.note = entryText
                    .slice(startBracketIndex + 1, endBracketIndex)
                    .trim();
                entryText = entryText
                    .slice(0, startBracketIndex)
                    .trim();
            }
        }

        // Check for min-max
        const regex = /^\d+-\d+/;
        const minMaxText = entryText.match(regex);
        if (minMaxText) {
            var minMaxValues = minMaxText[0].split('-');
            if (minMaxValues.length === 1) {
                result.min = minMaxValues[0];
                result.max = minMaxValues[0];
            }
            else if (minMaxValues.length === 2) {
                result.min = minMaxValues[0];
                result.max = minMaxValues[1];
            }
            entryText = entryText.slice(minMaxText[0].length).trim();
        }

        // Extract the battle card text
        result.battleCardText = entryText.trim();

        // Lookup the codes
        result.battleCardCode = lookupBattleCardCode(result.battleCardText);

        return result;
    }

    function extractBattleCardEntry(parsedEntry) {
        return _.pick(parsedEntry, ['min', 'max', 'battleCardCode', 'note']);
    }

    function lookupTypeCode(troopTypeText) {
        if (troopTypeText) {
            return troopTypes[troopTypeText.toUpperCase()];
        }
        else {
            return null;
        }
    }

    function lookupBattleCardCode(text) {
        if (text) {
            return battleCards[text.toUpperCase()];
        }
        else {
            return null;
        }
    }

    function isInternalAlly(sublistId) {
        return sublistId === 'w' || sublistId === 'x' || sublistId === 'y' || sublistId === 'z';
    }

    function makeDateRange(startDate, endDate) {
        if (startDate) {
            if (!endDate) {
                // No end date. Copy the start date.
                return { startDate: startDate, endDate: startDate };
            }
            else {
                // Start date and end date are used.
                return { startDate: startDate, endDate: endDate };
            }
        }
        else {
            // No start date. DateRange is null.
            return null;
        }
    }

    function importData() {
        importAllyArmyListData(function() {
            importTroopOptionData(function() {
                // done
            });
        });
    }

    var deleteAllyArmyLists;
    function importAllyArmyListData(cb) {
        // Slice the data
        var slicedData = [];
        var sliceSize = 50;
        var index = 0;
        var done = false;
        while (!done) {
            var start = index;
            var end = index + sliceSize;
            if (end > vm.allyArmyListArray.length) {
                end = vm.allyArmyListArray.length;
                if (end > start) {
                    var slice = vm.allyArmyListArray.slice(start, end);
                    slicedData.push(slice);
                }
                done = true;
            }
            else {
                var slice = vm.allyArmyListArray.slice(start, end);
                slicedData.push(slice);
                index = end;
            }
        }

        // Send each slice
        deleteAllyArmyLists = true;
        async.mapSeries(slicedData, importAllyArmyListSlice, function (err, sliceSummary) {
            if (err) {
                console.log('Unable to import ally army list data');
                console.log(err);
            }
            else {
                // Sum the summary data from each slice
                var importSummary = sliceSummary.reduce(function (previous, current) {
                    return {
                        imported: previous.imported + current.imported,
                        failed: previous.failed + current.failed
                    }
                });

                // Report the results
                console.info('Successfully imported ' + importSummary.imported + ' ally army lists.');
            }

            return cb();
        });
    }

    function importAllyArmyListSlice(slice, cb) {
        var importRequest = {
            options: {
                deleteAll: deleteAllyArmyLists
            },
            data: slice
        };

        // Import the army lists
        AllyArmyListImportService.import(
            importRequest,
            function (importSummary) {
                // Only delete on the first slice
                deleteAllyArmyLists = false;

                return cb(null, importSummary);
            },
            function (response) {
                console.error(response.data);
                return cb(response.data);
            }
        );
    }

    function importTroopOptionData(cb) {
        if (vm.parsedData.length) {

            // Only send a slice of data in each request

            // Initialize the progress bar
            vm.importProgress.numberTotal = vm.parsedData.length;
            vm.importProgress.numberDone = 0;
            vm.importProgress.running = true;

            // Slice the data
            var slicedData = [];
            var sliceSize = 100;
            var index = 0;
            var done = false;
            while (!done) {
                var start = index;
                var end = index + sliceSize;
                if (end > vm.parsedData.length) {
                    end = vm.parsedData.length;
                    if (end > start) {
                        var slice = vm.parsedData.slice(start, end);
                        slicedData.push(slice);
                    }
                    done = true;
                }
                else {
                    var slice = vm.parsedData.slice(start, end);
                    slicedData.push(slice);
                    index = end;
                }
            }

            // Send each slice
            async.mapSeries(slicedData, importTroopOptionSlice, function(err, sliceSummary) {
                if (err) {
                    vm.statusMessage1 = 'Unable to import troop options.';
                    vm.statusMessage2 = '';
                    vm.file = null;
                    vm.parsedData = [];
                }
                else {
                    // Sum the summary data from each slice
                    var importSummary = sliceSummary.reduce(function (previous, current) {
                        return {
                            importedTroopOptions: previous.importedTroopOptions + current.importedTroopOptions,
                            importedArmyLists: previous.importedArmyLists + current.importedArmyLists,
                            failedArmyLists: previous.failedArmyLists + current.failedArmyLists,
                            errors: previous.errors.concat(current.errors)
                        }
                    });

                    // Report the results
                    console.info('Successfully imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.');
                    importSummary.errors.forEach(function(error) {
                        console.warn('*** ' + error);
                    });
                    vm.statusMessage1 = 'Imported ' + importSummary.importedTroopOptions + ' troop options for ' + importSummary.importedArmyLists + ' army lists.';
                    vm.statusMessage2 = importSummary.failedArmyLists + ' army lists were not imported due to errors.';
                    vm.file = null;
                    vm.parsedData = [];
                }

                removeProgressBarAfterDelay();

                return cb();
            });
        }
    }

    function importTroopOptionSlice(slice, cb) {
        var importRequest = {
            data: slice
        };

        // Import the troop options
        TroopOptionsImportService.import(
            importRequest,
            function(importSummary) {
                // Update the progress bar
                vm.importProgress.numberDone = vm.importProgress.numberDone + slice.length;

                return cb(null, importSummary);
            },
            function (response) {
                console.error(response.data);
                return cb(response.data);
            }
        );
    }

    function initializeTroopTypeData() {
        TroopTypeService.list(function(availableTroopTypes) {
            availableTroopTypes.forEach(function (item) {
                troopTypes[item.importName.toUpperCase()] = item.permanentCode;
            });
        });
    }

    function initializeBattleCardData() {
        BattleCardService.list(function(availableBattleCards) {
            availableBattleCards.forEach(function (item) {
                battleCards[item.importName.toUpperCase()] = item.permanentCode;
            });
        });
    }

    function removeProgressBarAfterDelay() {
        var timer = $interval(
            function() {
                vm.importProgress.running = false;
            },
            1000,
            1);
    }

    function convertTextToTroopEntry(entryText) {
        entryText = entryText.trim();
        // Remove any trailing 's'
        if (entryText.endsWith('s')) {
            entryText = entryText.slice(0, -1);
        }

        // Check for an annotation: [note]
        var note = null;
        var startBracketIndex = entryText.indexOf('[');
        if (startBracketIndex >= 0) {
            var endBracketIndex = entryText.indexOf(']');
            if (endBracketIndex >= 0) {
                note = entryText.slice(startBracketIndex + 1, endBracketIndex);
                entryText = entryText.slice(endBracketIndex + 1);
                entryText = entryText.trim();
                //console.log('found note: ' + note + ' for entry ' + entryText);
            }
        }

        // Check for dismounting type
        var dismountIndex = entryText.indexOf('//');
        var mainText = null;
        var dismountText = null;
        if (dismountIndex === -1) {
            mainText = entryText;
        }
        else {
            mainText = entryText.slice(0, dismountIndex).trim();
            dismountText = entryText.slice(dismountIndex + 2).trim();
        }

        // Lookup the codes
        var mainCode = troopTypes[mainText.toUpperCase()];
        var dismountCode = null;
        if (dismountText) {
            dismountCode = troopTypes[dismountText.toUpperCase()];
        }

        var troopEntry = {
            troopTypeCode: mainCode,
            dismountTypeCode: dismountCode,
            note: note
        };

        var result = {
            mainText: mainText,
            dismountText: dismountText,
            troopEntry: troopEntry
        };

        return result;
    }
}
