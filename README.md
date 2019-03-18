# Invincible Meshwesh

Army list manager.

## Globally Installed Packages

npm must be installed globally. All other packages are installed locally.

## Testing

### Server-Side API Tests

To start the server:

    >node bin/start-test-server.js

Before starting the server, the following environment variables should be defined:

* MONGODB_URL
* APP_ADMIN_TOKEN
* ADMIN_PASSWORD
* EDITOR_PASSWORD
* PORT

These environment variables may be defined in the shell or in `bin/deploy/test.env` (which is read by the server startup script).

To run the tests:

    >npm run server-api-test

This runs the Mocha test specs in `test/api`

### Client-Side Unit Tests

    >npm run client-unit-test
    
This runs a set of Karma tests defined in `karma.conf.js`

### Client-Side End-to-End Tests

To start webdriver-manager:

    >npm run start-webdriver
    
To run the tests:

    >npm run client-ui-test

This runs a set of Protractor tests defined in `protractor.conf.js`
