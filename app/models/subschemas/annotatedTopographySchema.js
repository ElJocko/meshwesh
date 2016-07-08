var mongoose = require('mongoose');

// Create the schema
var AnnotatedTopographySchema = new mongoose.Schema({
    value: { type: String, required: true },
    note: { type: String }
});

AnnotatedTopographySchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AnnotatedTopographySchema;
