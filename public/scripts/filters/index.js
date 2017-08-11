'use strict';

// Require all js files in this directory and all subdirectories
(function () {
    const context = require.context(".", true, /\.js$/);
    context.keys().forEach(function (key) {
        context(key);
    });
})();
