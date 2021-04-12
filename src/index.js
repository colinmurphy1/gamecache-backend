// Import node modules
require('dotenv').config();
const express = require('express');
const rateLimit = require("express-rate-limit");

// lib
var api_response = require('./lib/response.js');

// Define API routes
var auth = require('./api/auth.js');
var profile = require('./api/profile.js');
var games = require('./api/games.js');
var device = require('./api/device.js');
var manufacturer = require('./api/manufacturer.js');


// *****************************************************************************
// Setup app
var app = express();
app.use(express.json());


// *****************************************************************************
// Middleware

// Apply rate-limiting to API requests (100 req in 15 min)
// TODO: Make this configurable in .env
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use("/api/", apiLimiter);


// *****************************************************************************
// Routes

// Return a PONG, to verify the API is up and running
app.get('/ping', (req, res) => {
    return api_response(res, 200, "PONG", []);
});

// Load routes from their specific files
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/games', games);
app.use('/api/device', device);
app.use('/api/manufacturer', manufacturer);


// *****************************************************************************
// Start the express server on port 3000

app.listen(process.env.APP_PORT, () => {
    console.log("Server is running on port", process.env.APP_PORT);
});
