// Load environment variables
const dotenv = require('dotenv');
dotenv.load({ path: './bin/deploy/dev.env' });

// Load the app
const app = require('../server');
