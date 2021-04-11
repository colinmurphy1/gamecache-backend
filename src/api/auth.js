var express = require('express');
var argon2 = require('argon2');
var crypto = require('crypto');

var api_response = require('../lib/response');
var hashPassword = require('../lib/hash_password.js');

var User = require('../models/User.js');

var router = express.Router();

/* User registration */
router.post('/register', async function(req, res) {
    // {"username": "username-here", "email": "email-here", "password": "password-here"}
    const data = req.body;

    // Create a new user 
    var createUser = await User.create({
        username: data.username,
        email: data.email,
        password: await hashPassword(data.password)
    }).then(function(value) {
        // user creation successful
        return true;
    })
    .catch(function(error) {
        // Error encountered while creating user
        console.log(error);
        return false;
    });

    if (createUser) {
        return api_response(res, 200, "OK", "");
    }

    return api_response(res, 400, "Error", "Could not create user");
});


/* User Login */
router.post('/login', async function(req, res) {
    // {"username": "Username-Here", "password": "Password-Here"}
    const data = req.body;
    
    // Search for the user in the User table
    var user = await User.findOne({
        where: {
            username: data.username
        }
    }).then(function(model) {
        return model;
    })
    .catch(function(error) {
        //console.log(error);
        return false;
    });

    // No user found
    if (! user) {
        return api_response(res, 404, "UserNotValid", "");
    }

    // Verify hash
    var matches = await argon2.verify(user.password, data.password);
    
    if (! matches) {
        return api_response(res, 401, "Unauthorized", "");
    }

    // Generate a new random token, and set the expiration time to 1 hour from now.
    user.token = crypto.randomBytes(64).toString('hex');
    user.token_expires_at = Date.now() + (1000 * 60 * 60 * 2);

    // Save this to the database 
    await user.save();

    // User logged in, give token and token expiration time
    return api_response(res, 200, "OK", {
        token: user.token,
        token_expires_at: user.token_expires_at
    });
});


module.exports = router;
