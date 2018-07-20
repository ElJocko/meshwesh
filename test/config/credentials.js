'use strict';

const config = require('./config');

const credentials = new Map();
credentials.set('admin', config.credentials.admin);
credentials.set('editor', config.credentials.editor);

module.exports = credentials;
