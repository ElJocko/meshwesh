var mongoose = require('mongoose');

// Create the schema
var AnnotatedTopographySchema = new mongoose.Schema({
    note: { type: String },
    values: [ String ]
});

AnnotatedTopographySchema.set('toObject', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AnnotatedTopographySchema;
