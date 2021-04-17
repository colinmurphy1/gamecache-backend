// Load modules
var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');

// Load database
var db = require('../database/db.js');

var router = express.Router();

// View your game collection
router.get('/', auth, async function(req, res) {
    // Load list of games
    var games = await req.user.getGames({
        include: [ {model: db.Device} ]
    });

    return api_response(res, 200, "OK", games);
});


// Add game to collection
router.post('/', auth, async function(req, res) {
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

    // Add game to database, using game and user ids
    var addGame = await db.UserGame.create({
        UserId: req.user.id,
        GameId: data.gameId,
        notes: data.notes,
        rating: data.rating
    })
    .then(function(value) {
        //console.log(value);
        return value;
    })
    .catch(function(error) {
        return false;
    });

    // Something went wrong adding the game
    if (! addGame) {
        return api_response(res, 500, "AddGameError", "");
    }

    return api_response(res, 200, "OK", data);
});


// Delete game from collection
router.delete("/:gameid", auth, async function(req, res) {
    const gameId = req.params['gameid'];

    // Find game in the UserGame table
    var findGame = await db.UserGame.findOne({
        where: { id: gameId }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    // Check if the game exists
    if (! findGame) {
        return api_response(res, 404, "GameNotFound", {
            "message": "This game does not exist"
        })
    }

    // Verify ownership of the game
    if (findGame.UserId != req.user.id) {
        return api_response(res, 403, "OwnershipError", {
            "message": "This game does not belong to you"
        })
    }

    // Remove the game from the table
    findGame.destroy();

    return api_response(res, 200, "OK", {
        "message": `Removed game from collection`
    });
});

// Change rating or notes
router.put("/", auth, async function(req, res) {
    const data = req.body;

    // Verify inputs
    const schema = Joi.object({
        // Game ID
        gameId: Joi.number().required(),
        // Notes, optional.
        notes: Joi.string().allow('').default('').optional(),
        // 1-5 star rating system, optional.
        rating: Joi.number().default(0).min(0).max(5).optional()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Find game in the UserGame table
    var findGame = await db.UserGame.findOne({
        where: { id: data.gameId }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false;
    });

    // Check if the game exists
    if (! findGame) {
        return api_response(res, 404, "GameNotFound", {
            "message": "This game does not exist"
        })
    }

    // Verify ownership of the game
    if (findGame.UserId != req.user.id) {
        return api_response(res, 403, "OwnershipError", {
            "message": "This game does not belong to you"
        })
    }

    // Check for changes
    for (var key in data) {
        // Skip game id
        if (key == "gameId") { continue; }
    
        // Make any required changes based on the specified data
        if (data[key] != findGame[key]) {
            findGame[key] = data[key];
        }
    }

    // Save changes
    await findGame.save();

    return api_response(res, 200, "OK", "");
});


module.exports = router;
