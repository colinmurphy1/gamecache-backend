var express = require('express');
const { Op } = require('sequelize');

var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');
var getUserByName = require('../lib/getUserByName.js');

// Load database
var db = require('../database/db.js');

var router = express.Router();

/**
 * @api {get} /api/profile/all View all public profiles on Gamecache
 * @apiName All public users
 * @apiGroup Profile
 * @apiDescription Displays a list of all users (including yourself, if
 * logged in) on Gamecache
 * 
 * @apiHeader {String} Authorization Authorization token (If logged in)
 * 
 * @apiError UserLoadError Could not load the list of users
 */
router.get('/all', async function(req, res) {
    const myToken = req.header('Authorization');
    
    // Get all users that have public profiles, including the current
    // logged in user
    var getUsers = await db.User.findAll({
        where: {
            [Op.or]: [
                {public_profile: true},
                {token: myToken}
            ]
        },
        attributes: {
            exclude: [
                'email', 'password', 'public_profile', 'token',
                'token_expires_at', 'bio', 'updatedAt', 'admin'
            ]
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false
    });

    if (! getUsers) {
        return api_response(res, 500, "UserLoadError", []);
    }

    return api_response(res, 200, "OK", getUsers);

});


/**
 * @api {get} /api/profile/user/:username View a users profile 
 * @apiName View profile
 * @apiGroup Profile
 * @apiDescription Displays a public user's profile if it is public, or your
 * profile.
 * 
 * @apiHeader {String} Authorization Authorization token (If logged in)
 * 
 * @apiError UserNotFound The specified user does not exist
 * @apiError NotAuthorized This user does not have a public profile
 */
router.get('/user/:username', async function(req, res) {
    const username = req.params['username'];

    // Find user
    const getUser = await getUserByName(username);

    // Display a message if the user does not exist
    if (! getUser) {
        return api_response(res, 404, "UserNotFound", []);
    }

    // Profiles will only be visible if the profile is public, or you are
    // viewing your own profile
    const myToken = req.header('Authorization');
    if (getUser.public_profile === false && getUser.token != myToken) {
        return api_response(res, 401, "NotAuthorized", []);
    }

    // Return profile
    return api_response(res, 200, "OK", {
        "username": username,
        "bio": getUser.bio,
        "dateJoined": getUser.createdAt
    });
});


module.exports = router;
