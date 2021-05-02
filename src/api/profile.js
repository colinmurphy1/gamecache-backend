var express = require('express');
const { Op } = require('sequelize');

var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');
var getUserByName = require('../lib/getUserByName.js');

// Load database
var db = require('../database/db.js');

var router = express.Router();

// You must be logged in to see profiles
router.use(auth);


/* List all users */
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


/* Individual user profile */
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
        "favoriteGame": null
    });
});


module.exports = router;
