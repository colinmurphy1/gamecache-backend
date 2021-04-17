var express = require('express');
var argon2 = require('argon2');
var crypto = require('crypto');
const Joi = require('joi');

var api_response = require('../lib/response');

var db = require('../database/db.js');

var router = express.Router();

/* User registration */
router.post('/register', async function(req, res) {
    // {"username": "username-here", "email": "email-here", "password": "password-here"}
    const data = req.body;

    // Validate user input
    const schema = Joi.object({
        username: Joi.string().alphanum().max(16),
        email: Joi.string().email(),
        password: Joi.string().min(8)
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Create a new user 
    var createUser = await db.User.create({
        username: data.username,
        email: data.email,
        password: await argon2.hash(data.password)
    }).then(function(value) {
        // user creation successful
        return true;
    })
    .catch(function(error) {
        // Error encountered while creating user
        console.log(error);
        return false;
    });

    if (! createUser) {
        return api_response(res, 400, "Error", "Could not create user");
    }

    return api_response(res, 200, "OK", "");
});


/* User Login */
router.post('/login', async function(req, res) {
    // {"username": "Username-Here", "password": "Password-Here"}
    const data = req.body;
    
    // Validate user input
    const schema = Joi.object({
        username: Joi.string().alphanum().max(16),
        password: Joi.string().min(8)
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Search for the user in the User table
    var user = await db.User.findOne({
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
