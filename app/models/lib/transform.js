'use strict';

module.exports = {
    removeDatabaseArtifacts: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
    },
    removeDatabaseArtifactsAndSanitizeUser: function (doc, ret, options) {
        ret.id = ret._id.toHexString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.salt;
    },
    documentsToObjects: function(documents) {
        var objects = [];
        for (var i = 0; i < documents.length; ++i) {
            var object = documents[i].toObject();
            objects.push(object);
        }
        return objects;
    },
    removeDatabaseArtifactsFromObject: function(object) {
        object.id = object._id.toHexString();
        delete object._id;
        delete object.__v;
    }
};
