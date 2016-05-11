'use strict';

module.exports = {
    toJSON: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    },
    removeDatabaseArtifacts: function(document) {
        document.id = document._id.toHexString();
        delete document._id;
        delete document.__v;
    },
    sanitizeUser: function(document) {
        delete document.passwordHash;
        delete document.salt;
    }
};
