# Invincible Meshwesh

Army list manager.

## Globally Installed Packages

The following packages should be installed globally:

* bower
* grunt-cli
* karma-cli
* mocha
* protractor

TBD: Make sure this list is correct. (bower and mocha are currently installed globally, but are also in the
package.json. So they can probably be safely removed from one of those locations.)

## Testing

### Client-Side Unit Tests

    >karma start

### Client-Side End-to-End Tests

    >protractor protractor.conf.js

(Node 0.12.x requires Protractor 2.5.1)