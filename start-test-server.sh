#!/bin/bash

printf "\n*** Setting correct version of npm. ***\n\n"
. ~/.nvm/nvm.sh
nvm use

printf "\n*** Starting server. ***\n\n"
node ./bin/start-test.js
