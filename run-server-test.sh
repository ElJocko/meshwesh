#!/bin/bash

printf "\n*** Restoring database to starting state. ***\n\n"
mongoimport --db meshwesh-test --collection thematiccategories --drop --file test/data/thematic-categories.json

printf "\n*** Starting API test. ***\n\n"
grunt test-server
