#!/bin/bash

printf "\n*** Setting correct version of npm. ***\n\n"
. ~/.nvm/nvm.sh
nvm use

printf "\n*** Restoring database to starting state. ***\n\n"
mongoimport --db meshwesh-test --collection thematiccategories --drop --file test/data/thematic-categories.json

printf "\n*** Starting API test. ***\n\n"
./node_modules/.bin/grunt test-server
