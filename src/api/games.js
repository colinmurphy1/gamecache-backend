// Load modules
var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');
var auth_admin = require('../middleware/auth_admin.js');

// Load database
var Game = require('../models/Game.js');
var Device = require('../models/Device.js');
var User = require('../models/User.js');
var UserGame = require('../models/UserGame.js');

var router = express.Router();

// Game list
router.get('/', async function(req, res) {

    // Find all games and their associated console (device)
    var getGames = await Game.findAll({
        include: Device
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    if (! getGames) {
        return api_response(res, 404, "BAD", {
            "message": "Could not retrieve games"
        });
    }

    // Build a list of games in some cleaner JSON
    var gameList = []
    for (var game in getGames) {
        gameList.push({
            "title": getGames[game].title,
            "publisher": getGames[game].publisher,
            "year": getGames[game].year,
            "device": getGames[game]["Device"].name,
            "device_short": getGames[game]["Device"].shortname
        });
    }

    // Show the clean JSON list
    return api_response(res, 200, "OK", gameList);
});


// Add a game to the games list
router.post('/', auth, async function(req, res) {
    const data = req.body;

    // Verify that all required data is passed
    const schema = Joi.object({
        title: Joi.string().required(),
        publisher: Joi.string().required(),
        year: Joi.number().required(),
        device: Joi.number().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Create game entry in the database
    var newGame = await Game.create({
        title: data.title,
        publisher: data.publisher,
        year: data.year,
        DeviceId: data.device
    })
    .then(function(value) {
        return true;
    })
    .catch(function(error) {
        return false;
    });

    // Display an error on duplicate entries, or other errors
    if (! newGame) {
        return api_response(res, 400, "Error", {
            "message": "Could not add game to the database"
        });
    }

    return api_response(res, 200, "OK", "");
});

// Delete a game (Admin only)
router.delete('/', auth_admin, async function(req, res) {
    const data = req.body;

    // Validate input
    const schema = Joi.object({
        id: Joi.number().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});
    
    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Find game by ID
    var deleteGame = await Game.findOne({
        where: {
            id: data.id
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false;
    });

    if (! deleteGame) {
        return api_response(res, 404, "GameNotFound", "");
    }

    // Delete it
    deleteGame.destroy();

    return api_response(res, 200, "OK", "");
});


module.exports = router;
