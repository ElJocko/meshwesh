var mongoose = require('mongoose');

// Create the schema
var AnnotatedRatingSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    note: { type: String }
});

AnnotatedRatingSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = AnnotatedRatingSchema;
