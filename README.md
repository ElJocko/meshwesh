# Invincible Meshwesh

Army list manager.

## Globally Installed Packages

npm must be installed globally. All other packages are installed locally.

## Testing

### Server-Side API Tests

To start the server:

    >bash ./start-server-for-test.sh

To run the test:

    >bash ./run-api-test.sh

### Client-Side Unit Tests

    >./node_module/.bin/karma start

### Client-Side End-to-End Tests

    >./node_module/.bin/protractor protractor.conf.js

(Node 0.12.x requires Protractor 2.5.1)