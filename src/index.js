// Import node modules
require('dotenv').config();
const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');

// Define API routes
var auth = require('./api/auth.js');
var profile = require('./api/profile.js');
var games = require('./api/games.js');
var device = require('./api/device.js');
var manufacturer = require('./api/manufacturer.js');
var collection = require('./api/collection.js');
var news = require('./api/news.js');
var developer = require('./api/developer.js');


// *****************************************************************************
// Setup app
var app = express();
app.use(express.json());


// *****************************************************************************
// Middleware

// Apply rate-limiting to API requests

if (process.env.APP_RATELIMIT === "true") {
    const window = (process.env.APP_RATELIMIT_TIME || 15);
    const max = process.env.APP_RATELIMIT_WINDOW || 500;
    console.log(
        `API rate limiting is enabled: ${max} requests within ${window} minutes`
    )
    const apiLimiter = rateLimit({
        windowMs: window * 60 * 1000, // convert minutes to milliseconds
        max
    });
    app.use("/api/", apiLimiter);
}

// Enable CORS for frontend API access
app.use(cors());


// *****************************************************************************
// Routes

// Load routes from their specific files
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/games', games);
app.use('/api/device', device);
app.use('/api/manufacturer', manufacturer);
app.use('/api/collection', collection);
app.use('/api/news', news);
app.use('/api/developer', developer);



// *****************************************************************************
// Start the express server

app.listen(process.env.APP_PORT, () => {
    console.log("\nServer is listening on port", process.env.APP_PORT);
});
