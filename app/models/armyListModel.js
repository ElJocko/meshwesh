'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ArmyList', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            gal_id: DataTypes.INTEGER,
            name: DataTypes.STRING
        },
        {
            timestamps: false,
            tableName: 'army_list'
        });
};

