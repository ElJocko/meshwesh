'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ArmyList', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            gal_id: DataTypes.INTEGER,
            name: DataTypes.STRING,
            date_ranges: DataTypes.ARRAY(DataTypes.RANGE(DataTypes.INTEGER))
        },
        {
            timestamps: false,
            tableName: 'army_list',
            hooks: {
                afterFind: afterFind,
                beforeUpdate: beforeUpdate
            }
        });
};

function afterFind(armyList, options) {
    // Ranges are returned with an exclusive value for the upper part. So convert the returned
    // exclusive value to an inclusive.
    if (armyList.date_ranges) {
        for (var i = 0; i < armyList.date_ranges.length; ++i) {
            var dateRange = armyList.date_ranges[i];
            dateRange[1] = dateRange[1] - 1;
        }
    }
}

function beforeUpdate(armyList, options) {
    // Ranges are saved with "exclusive" values. So convert our inclusive range to exclusive values.
    if (armyList.date_ranges) {
        for (var i = 0; i < armyList.date_ranges.length; ++i) {
            var dateRange = armyList.date_ranges[i];
            dateRange[0] = dateRange[0] - 1;
            dateRange[1] = dateRange[1] + 1;
        }
    }
}

