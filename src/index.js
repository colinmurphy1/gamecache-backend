// Import node modules
require('dotenv').config();
const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

// lib
var api_response = require('./lib/response.js');

// Define API routes
var auth = require('./api/auth.js');
var profile = require('./api/profile.js');
var games = require('./api/games.js');
var device = require('./api/device.js');
var manufacturer = require('./api/manufacturer.js');
var collection = require('./api/collection.js');
var news = require('./api/news.js');


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

// Enable CORS for frontend API access
app.use(cors());


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
app.use('/api/collection', collection);
app.use('/api/news', news);


// *****************************************************************************
// Start the express server

app.listen(process.env.APP_PORT, () => {
    console.log("Server is running on port", process.env.APP_PORT);
});
