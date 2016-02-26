'use strict';

module.exports = {
    toJSON: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    }
};
