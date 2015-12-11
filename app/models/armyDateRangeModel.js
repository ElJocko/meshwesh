'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ArmyDateRange', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            army_list_id: DataTypes.INTEGER,
            start_date: DataTypes.INTEGER,
            end_date: DataTypes.INTEGER
        },
        {
            timestamps: false,
            tableName: 'army_date_range'
        });
};

