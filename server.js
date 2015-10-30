'use strict';

if (process.env.LOAD_ENV) {
    var dotenv = require('dotenv');
    dotenv.load();   // .env
}

var app = require('./index.js');
