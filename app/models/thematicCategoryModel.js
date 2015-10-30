'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("ThematicCategory", {
        id: DataTypes.INTEGER,
        name: DataTypes.STRING
    });
};


