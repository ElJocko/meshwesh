'use strict';

var Sequelize = require('sequelize');
var config    = require('../lib/config');

// initialize database connection
var sequelize = new Sequelize(config.database.url, config.database.options);

// load models
var models = [
    'thematicCategoryModel',
    'grandArmyListModel',
    'armyListModel'
];
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// export connection
module.exports.sequelize = sequelize;
