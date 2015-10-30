'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ThematicCategory', {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: DataTypes.STRING
        },
        {
            timestamps: false,
            tableName: 'thematic_category'
        });
};


