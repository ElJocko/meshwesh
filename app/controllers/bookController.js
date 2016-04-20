'use strict';

var bookService = require('../services/bookService');
var logger = require('../lib/logger');

module.exports.retrieveByQuery = function(req, res) {
    var query = { }; // Default is all
    if (req.query.name) {
        query.name = req.query.name;
    }
    bookService.retrieveByQuery(query, function(err, books) {
        if (err) {
            logger.error('Failed with error: ' + err);
            return res.status(500).send('Unable to get Books. Server error.');
        }
        else {
            return res.status(200).send(books);
        }
    });
};
