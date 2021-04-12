var express = require('express');
const { Op } = require('sequelize');

var api_response = require('../lib/response');
var auth = require('../middleware/auth.js');

const User = require('../models/User.js');

var router = express.Router();

// You must be logged in to see profiles
router.use(auth);


/* List all users */
router.get('/all', async function(req, res) {
    const myToken = req.header('Authorization');
    
    // Get all users that have public profiles, including the current
    // logged in user
    var getUsers = await User.findAll({
        where: {
            [Op.or]: [
                {public_profile: true},
                {token: myToken}
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
        return api_response(res, 500, "UserLoadError", {
            "message": "Could not load users"
        });
    }

    // Create a new list of users
    // NOTE: More information may be displayed here in the future, such
    // as profile pictures, etc.
    var usersList = [];

    for (var user in getUsers) {
        usersList.push({
            "username": getUsers[user].username
        });
    }

    return api_response(res, 200, "OK", usersList);

});


/* Individual user profile */
router.get('/:username', async function(req, res) {
    const username = req.params['username'];

    // Find user
    var getUser = await User.findOne({
        where: {
            username: username
        }
    })
    .then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false;
    });

    // Display a message if the user does not exist
    if (! getUser) {
        return api_response(res, 404, "UserNotFound", {
            "message": `${username} does not exist`
        });
    }

    // Profiles will only be visible if the profile is public, or you are
    // viewing your own profile
    myToken = req.header('Authorization');
    if (! getUser.public_profile === true || ! myToken === getUser.token) {
        return api_response(res, 401, "NotAuthorized", {
            "message": `${username}'s profile is private`
        });
    }

    // Return profile
    return api_response(res, 200, "OK", {
        "username": username,
        "bio": getUser.bio,
        "favoriteGame": null
    });
});


module.exports = router;
