// Load modules
var express = require('express');
var api_response = require('../lib/response');

// Load database
var Game = require('../models/Game.js');
var Device = require('../models/Device.js');

var router = express.Router();

// Game list
router.get('/all_games', function(req, res) {
    return api_response(res, 200, "OK", "This will return a list of games");
});


module.exports = router;
