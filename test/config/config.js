'use strict';

module.exports = {
    data: {
        badId: 'FFFFFFFFFFFFFFFFFFFFFFFF'
    },
    credentials: {
        admin: {
            emailAddress: process.env.ADMIN_ROLE_EMAIL || "",
            password: process.env.ADMIN_ROLE_PASSWORD || ""
        },
        editor: {
            emailAddress: process.env.EDITOR_ROLE_EMAIL || "",
            password: process.env.EDITOR_ROLE_PASSWORD || ""
        }
    },
    testServer: {
        url: process.env.SERVER_URL || ""
    },
    testRoles: ['admin', 'editor', 'anonymous']
};
