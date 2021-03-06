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
        // User MUST be enabled AND your own profile OR a public profile to be
        // visible in this list
        where: {
            enabled: true,
            [Op.or]: [
                {public_profile: true},
                // If there's no token specified, don't use it in the query
                myToken ? {token: myToken} : {}
            ]
        },
        attributes: {
            exclude: [
                'email', 'password', 'public_profile', 'token',
                'bio', 'createdAt', 'updatedAt', 'admin'
            ]
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        console.log(error);
        return false
    });

    if (! getUsers) {
        return api_response(res, 500, "UserLoadError", []);
    }


    // Create a custom formatted user list. More may be displayed here in the
    // future, such as game counts
    const curTime = Date.now();
    let userList = [];

    for (user of getUsers) {
        userList.push({
            "id": user.id,
            "username": user.username,
            //"joinDate": user.createdAt,
            "online": user.token_expires_at > curTime
        });

    }

    return api_response(res, 200, "OK", userList);

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
        return api_response(res, 404, "UserNotFound", {});
    }

    // Verify the user is enabled
    if (! getUser.enabled) {
        return api_response(res, 401, "UserDisabled", {});
    }

    // Profiles will only be visible if the profile is public, or you are
    // viewing your own profile
    const myToken = req.header('Authorization');
    if (getUser.public_profile === false && getUser.token != myToken) {
        return api_response(res, 401, "NotAuthorized", {});
    }

    // Return profile
    return api_response(res, 200, "OK", {
        "username": username,
        "bio": getUser.bio,
        "dateJoined": getUser.createdAt,
        "admin": getUser.admin,
        "online": getUser.token_expires_at > Date.now()
    });
});


module.exports = router;
