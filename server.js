'use strict';

const envFile = process.env.LOAD_ENV;

if (envFile) {
    const dotenv = require('dotenv');

    if (envFile == 1) {
        // Default file
        dotenv.load();   // .env
    }
    else {
        dotenv.load({ path: envFile });
    }
}

var app = require('./index.js');
