// Load modules
var express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');

var api_response = require('../lib/response');
var auth_admin = require('../middleware/auth_admin.js');
var getGameById = require('../lib/getGameById');

// Load database
var db = require('../database/db.js');

var router = express.Router();

/**
 * @api {get} /api/games View all games
 * @apiName View all game
 * @apiGroup Game
 * 
 * @apiSuccess {Object} data The resulting list of games
 * 
 * @apiError GameLoadError Could not retrieve the list of games
 */
router.get('/', async function(req, res) {

    // Find all games and their associated console (device)
    var getGames = await db.Game.findAll({
        include: [
        {
            model: db.Device,
            attributes: ['id', 'name', 'shortname']
        },
        {
            model: db.Developer,
            attributes: ['id', 'name']
        }
        ],
        attributes: {
            exclude: ['DeviceId', 'createdAt', 'updatedAt']
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    if (! getGames) {
        return api_response(res, 404, "GameLoadError", []);
    }

    // Show the clean JSON list
    return api_response(res, 200, "OK", getGames);
});


// Add a game to the games list
router.post('/', auth_admin, async function(req, res) {
    const data = req.body;

    // Verify that all required data is passed
    const schema = Joi.object({
        title: Joi.string().required(),
        developerId: Joi.number().required(),
        year: Joi.number().required(),
        device: Joi.number().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Create game entry in the database
    var newGame = await db.Game.create({
        title: data.title,
        developerId: data.developerId,
        year: data.year,
        DeviceId: data.device
    })
    .then(function(value) {
        return value;
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

    return api_response(res, 200, "OK", newGame);
});


// View a single game
router.get('/id/:gameid', async function(req, res) {
    const gameId = req.params['gameid'];

    // Find game by ID
    const game = await getGameById(gameId);

    // Check if game exists
    if (! game) {
        return api_response(res, 404, "GameNotFound", "");
    }

    // Get users who own the game
    const myToken = req.header('Authorization');

    const gameOwners = await game.getUsers({
        where: {
            // Only show users who have a public profile, including yourself
            [Op.or]: [
                {public_profile: true},
                // If there's no token specified, don't use it in the query
                myToken ? {token: myToken} : {}
            ]
        },
        attributes: ['id', 'username']
    });

    // Calculate average rating
    // TODO: Do this in a cleaner way. Use an array? 
    let starTotal = 0;
    let starUsers = 0;
    for (user of gameOwners) {
        // skip unrated games
        if (user.UserGame.rating === 0) continue; 

        starTotal += user.UserGame.rating;
        starUsers += 1;
    }
    const gameRating = starTotal / starUsers || 0;

    // Return game information
    return api_response(res, 200, "OK", {
        info: game,
        rating: {
            value: gameRating,
            users: starUsers
        },
        owners: gameOwners
    });

});



// Delete a game (Admin only)
router.delete('/id/:gameid', auth_admin, async function(req, res) {
    const gameId = req.params['gameid'];

    // Find game by ID
    var deleteGame = await getGameById(gameId);

    if (! deleteGame) {
        return api_response(res, 404, "GameNotFound", "");
    }

    // Delete it
    deleteGame.destroy();

    return api_response(res, 200, "OK", {
        "title": deleteGame.title,
        "gameId": deleteGame.id
    });
});


module.exports = router;
