var mongoose = require('mongoose');

// Create the schema
var DateRangeSchema = new mongoose.Schema({
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true }
});

DateRangeSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
    }
});

module.exports = DateRangeSchema;
