// Load modules
var express = require('express');
const Joi = require('joi');
// Csv
const { writeToString } = require('@fast-csv/format');


var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');

// Load database
var db = require('../database/db.js');
const getUserByName = require('../lib/getUserByName');

var router = express.Router();

/**
 * @api {get} /api/collection View collection
 * @apiName View Collection
 * @apiGroup Collection
 * @apiDescription Returns the game collection of the logged in user.
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiError UserNotFound The specified user account does not exist
 * 
 * @apiSuccess {Object} games A list of games in your collection.
 */
router.get('/user/:username', async function(req, res) {
    const username = req.params['username'];
    const token = req.header('Authorization');

    // Get user
    const user = await getUserByName(username);
 
    // user does not exist
    if (! user) {
        return api_response(res, 404, "UserNotFound", []);
    }

    // Only permit the collection to be viewed if a) you are viewing your
    // profile, or b) the users' profile is public
    if (user.public_profile === false && user.token != token) {
        return api_response(res, 401, "NotAuthorized", []);
    }

    // Load list of games
    var games = await user.getGames({
        include: [
            {
                model: db.Device
            }
        ]
    });

    // Create a cleaner games list
    var gamesList = [];
    for (const game in games) {
        gamesList.push({
            'id': games[game].UserGame.id,
            'gameId': games[game].id,
            'title': games[game].title,
            'publisher': games[game].publisher,
            'year': games[game].year,
            'rating': games[game].UserGame.rating,
            'status': games[game].UserGame.status,
            'notes': games[game].UserGame.notes,
            'deviceId': games[game].Device.id,
            'deviceName': games[game].Device.name,
            'deviceShortname': games[game].Device.shortname
        });
    }

    return api_response(res, 200, "OK", gamesList);
});


/**
 * @api {post} /api/collection Add a game to your collection
 * @apiName Add to collection
 * @apiGroup Collection
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiParam {Number} gameId ID of the game to add to your collection
 * (see Games API)
 * @apiParam {String} [notes] Specific notes to add to the game
 * @apiParam {Number=0-5} [rating] Rating from 1-5 stars, with 0 being unrated.
 * 
 * @apiSuccess {String} name Name of the game
 * @apiSuccess {Number} gameId New ID number of the game
 * 
 * @apiError InputValidationError The data input did not match the requirements.
 * @apiError AddGameError The game could not be added because it does not
 * exist, or already exists in the database.
 */
router.post('/', auth, async function(req, res) {
    const data = req.body;

    // Validate user input
    const schema = Joi.object({
        // Game ID
        gameId: Joi.number().required(),

        // Notes, optional.
        notes: Joi.string().allow('').optional(),

        // 1-5 star rating system, optional.
        rating: Joi.number().default(0).min(0).max(5).optional(),

        // Status
        status: Joi.number().default(0).min(0).max(3).optional()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", []);
    }

    // Add game to database, using game and user ids
    var addGame = await db.UserGame.create({
        UserId: req.user.id,
        GameId: data.gameId,
        notes: data.notes,
        rating: data.rating,
        status: data.status
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
        return api_response(res, 500, "AddGameError", []);
    }

    return api_response(res, 200, "OK", []);
});


/**
 * @api {delete} /api/collection/:gameId Remove a game from your collection
 * @apiName Remove from collection
 * @apiGroup Collection
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiParam {Number} gameId ID of the game to remove from your collection
 * 
 * @apiSuccess {String} message Game removed from your collection
 * 
 * @apiError GameNotFound The game does not exist in your collection
 * @apiError AccessDenied The game does not belong to you
 */
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
        return api_response(res, 403, "AccessDenied", {
            "message": "This game does not belong to you"
        })
    }

    // Remove the game from the table
    findGame.destroy();

    return api_response(res, 200, "OK", {
        "message": `Removed game from collection`
    });
});

/**
 * @api {put} /api/collection Change information about a game in your collection
 * @apiName Change information about a game in your collection
 * @apiGroup Collection
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiParam {Number} gameId ID of the game in your collection
 * @apiParam {String} [notes] Specific notes to add to the game
 * @apiParam {Number=0-5} [rating] Rating from 1-5 stars, with 0 being unrated.
 * 
 * @apiSuccess {String} message Game removed from your collection
 * 
 * @apiError InputValidationError The passed data is incorrect
 * @apiError GameNotFound The game does not exist in your collection
 * @apiError AccessDenied The game does not belong to you
 */
router.put("/", auth, async function(req, res) {
    const data = req.body;

    // Verify inputs
    const schema = Joi.object({
        // Game ID
        gameId: Joi.number().required(),
        
        // Notes, optional.
        notes: Joi.string().allow('').default('').optional(),

        // 1-5 star rating system, optional.
        rating: Joi.number().default(0).min(0).max(5).optional(),

        // Status
        status: Joi.number().default(0).min(0).max(3).optional()
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
        return api_response(res, 403, "AccessDenied", {
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

    return api_response(res, 200, "OK", []);
});


/**
 * @api {get} /api/collection/csv Export collection as CSV
 * @apiName Export collection
 * @apiGroup Collection
 * @apiDescription Exports a users' game collection as CSV 
 * 
 * @apiHeader {String} Authorization Authorization token
 */
router.get('/user/:username/csv', async function (req, res) {

    // Status messages
    const statusTypes = ['Unplayed', 'InProgress', 'Completed', 'WontFinish'];

    const username = req.params['username'];
    const token = req.header('Authorization');

    // Get user
    const user = await getUserByName(username);
 
    // user does not exist
    if (! user) {
        return api_response(res, 404, "UserNotFound", []);
    }

    // Only permit the collection to be viewed if a) you are viewing your
    // profile, or b) the users' profile is public
    if (user.public_profile === false && user.token != token) {
        return api_response(res, 401, "NotAuthorized", []);
    }

    // Load list of games
    var games = await user.getGames({
        include: [
            {
                model: db.Device
            }
        ]
    });

    // Create an array to store the CSV data. Line 1 is the header 
    var gamesList = [
        [
            'id', 'gameid', 'title', 'publisher', 'year', 'rating', 'status',
            'notes', 'deviceId', 'deviceName', 'deviceShortname'
        ]
    ];
    for (const game in games) {
        gamesList.push([
            games[game].UserGame.id,
            games[game].id,
            games[game].title,
            games[game].publisher,
            games[game].year,
            games[game].UserGame.rating,
            statusTypes[games[game].UserGame.status],
            games[game].UserGame.notes,
            games[game].Device.id,
            games[game].Device.name,
            games[game].Device.shortname
        ]);
    }

    // Create CSV data
    const csvData = await writeToString(gamesList).then(data => data);

    // Send CSV output
    res.setHeader('Content-Type', 'text/csv');
    res.status(200);
    res.send(csvData.toString());
});

module.exports = router;
