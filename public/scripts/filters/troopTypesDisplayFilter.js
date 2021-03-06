angular
    .module('meshweshFilters')
    .filter('mwDisplayTroopTypes', TroopTypesFilter)
    .filter('mwDisplayTroopTypeEntriesList', TroopTypeEntriesListFilter)
    .filter('mwDisplayGeneralEntriesList', GeneralEntriesListFilter);

TroopTypesFilter.$inject = ['TroopTypeService'];
TroopTypeEntriesListFilter.$inject = ['TroopTypeService'];
GeneralEntriesListFilter.$inject = ['TroopTypeService'];

function TroopTypesFilter(TroopTypeService) {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    troopTypesFilter.reloadData = function() {
        troopTypesData = null;
        serviceInvoked = false;
    };

    troopTypesFilter.$stateful = true;
    function troopTypesFilter(input) {
        if (!input) {
            return '';
        }

        if (troopTypesData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                TroopTypeService.list(function(troopTypes) {
                    troopTypesData = troopTypes;
                });
            }
            return placeholder;
        }
        else {
            var display = troopTypeAsDisplayName(input);
            return display;
        }

        function troopTypeAsDisplayName(input) {
            var display = '';

            var troopType = _.find(troopTypesData, { 'permanentCode': input });
            if (troopType) {
                display = troopType.displayName;
            }

            return display;
        }
    }

    return troopTypesFilter;
}

function TroopTypeEntriesListFilter(TroopTypeService) {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    troopTypesListFilter.reloadData = function() {
        troopTypesData = null;
        serviceInvoked = false;
    };

    function troopTypesListFilter(input) {
        if (!input) {
            return '';
        }

        if (troopTypesData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                TroopTypeService.list(function(troopTypes) {
                    troopTypesData = troopTypes;
                });
            }
            return placeholder;
        }
        else {
            var display = troopTypesFilterFunction(input);
            return display;
        }

        function troopTypesFilterFunction(input) {
            var display = '';
            var firstValue = true;

            input.forEach(function(entry) {
                var troopType = _.find(troopTypesData, { 'permanentCode': entry.troopTypeCode });

                var dismountType = null;
                if (entry.dismountTypeCode) {
                    dismountType = _.find(troopTypesData, { 'permanentCode': entry.dismountTypeCode });
                }

                var note = null;
                if (entry.note) {
                    note = ' [' + entry.note + ']';
                }

                if (troopType) {
                    if (firstValue) {
                        display = display + troopType.displayName;

                        if (note) {
                            display = display + note;
                        }

                        firstValue = false;
                    }
                    else {
                        display = display + ' or ';

                        display = display + troopType.displayName;

                        if (note) {
                            display = display + note;
                        }
                    }

                    if (dismountType) {
                        display = display + '//' + dismountType.displayName;
                    }
                }
            });

            return display;
        }
    }

    return troopTypesListFilter;
}

function GeneralEntriesListFilter(TroopTypeService) {
    var troopTypesData = null;
    var serviceInvoked = false;
    var placeholder = '';

    troopTypesListFilter.reloadData = function() {
        troopTypesData = null;
        serviceInvoked = false;
    };

    function troopTypesListFilter(input) {
        if (!input) {
            return '';
        }

        if (troopTypesData === null) {
            if (!serviceInvoked) {
                serviceInvoked = true;
                TroopTypeService.list(function(troopTypes) {
                    troopTypesData = troopTypes;
                });
            }
            return placeholder;
        }
        else {
            var display = troopTypesFilterFunction(input);
            return display;
        }

        function troopTypesFilterFunction(input) {
            var display = '';
            var firstValue = true;
            var firstGroup = true;

            input.troopEntries.forEach(function (entry) {
                var troopType = _.find(troopTypesData, {'permanentCode': entry.troopTypeCode});

                var note = null;
                if (entry.note) {
                    note = ' [' + entry.note + ']';
                }

                if (troopType) {
                    if (firstValue) {
                        display = display + troopType.displayName;

                        if (note) {
                            display = display + note;
                        }

                        firstValue = false;
                    }
                    else {
                        display = display + ' or ';

                        display = display + troopType.displayName;

                        if (note) {
                            display = display + note;
                        }
                    }
                }
            });

            return display;
        }
    }

    return troopTypesListFilter;
}
