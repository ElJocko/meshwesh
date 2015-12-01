'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('GrandArmyList', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: DataTypes.STRING
        },
        {
            timestamps: false,
            tableName: 'grand_army_list'
        });
};


