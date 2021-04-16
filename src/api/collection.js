// Load modules
var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var getUserByToken = require('../lib/getUserByToken.js');
var auth = require('../middleware/auth.js');

// Load database
var UserGame = require('../models/UserGame.js');
var Game = require('../models/Game.js');
var Device = require('../models/Device.js');
var User = require('../models/User.js');

var router = express.Router();

// View your game collection
router.get('/', auth, async function(req, res) {
    const token = req.header('Authorization');

    // Get user information from their authentication token
    var getUserInfo = await getUserByToken(token);

    // This should always work, but just to be safe, check for errors.
    if (! getUserInfo) {
        return api_response(res, 404, "UserNotFound", "");
    }

    // Load list of games
    var gameCollection = await UserGame.findAll({
        where: {
            UserId: getUserInfo.id
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    if (! gameCollection) {
        return api_response(res, 500, "GameLoadError", "");
    }

    return api_response(res, 200, "OK", gameCollection);
});



// Add game to collection
router.post('/', auth, async function(req, res) {
    const token = req.header('Authorization');
    const data = req.body;

    // Validate user input
    const schema = Joi.object({
        // Game ID
        gameId: Joi.number().required(),
        // Notes, optional.
        notes: Joi.string().allow('').optional(),
        // 1-5 star rating system, optional.
        rating: Joi.number().default(0).min(0).max(5).optional()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Retrieve current user from their authentication token
    // TODO: Make a function that does this... I'm repeating myself a lot
    var getUserInfo = await getUserByToken(token);

    // This should always work, but just to be safe, check for errors.
    if (! getUserInfo) {
        return api_response(res, 404, "UserNotFound", "");
    }

    // Add game to database, using game and user ids
    var addGame = await UserGame.create({
        UserId: getUserInfo.id,
        GameId: data.gameId,
        game_notes: data.notes,
        game_rating: data.rating
    })
    .then(function(value) {
        //console.log(value);
        return true;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    // Something went wrong adding the game
    if (! addGame) {
        return api_response(res, 500, "AddGameError", "");
    }

    return api_response(res, 200, "OK", data);
});

module.exports = router;
