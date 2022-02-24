var express = require('express');
var argon2 = require('argon2');
var crypto = require('crypto');
const Joi = require('joi');

var api_response = require('../lib/response');
var getUserByName = require('../lib/getUserByName.js');
var auth = require('../middleware/auth.js');

var db = require('../database/db.js');

var router = express.Router();

/**
 * @api {post} /api/auth/register Create a user account
 * @apiName Register
 * @apiGroup Authentication
 * @apiDescription Create a new user account 
 *
 * @apiParam {String} username Username for the user account
 * @apiParam {String} email Email for the user account
 * @apiParam {string{8+}} password Password for the user account. Must be a minimum of
 * 8 characters.
 *
 * @apiSuccess {String} username Username of the new user account
 * 
 * @apiError UserCreationError Could not create the user account, likely due
 * to the username being claimed.
 */
router.post('/register', async function(req, res) {
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
        return value;
    })
    .catch(function(error) {
        // Error encountered while creating user
        console.log(error);
        return false;
    });

    if (! createUser) {
        return api_response(res, 400, "UserCreationError", []);
    }

    return api_response(res, 200, "OK", {
        "id": createUser.id,
        "username": data.username
    });
});


/**
 * @api {post} /api/auth/login Log in
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username for the user account
 * @apiParam {String} password Password for the user account.
 *
 * @apiSuccess {String} token A hexidecimal token
 * @apiSuccess {String} token_expires_at The time in which the token will
 * expire, which is one hour from the time of login.
 *
 * @apiError InputVaidationError The username and password do not meet the
 * required criteria.
 * @apiError Unauthorized Incorrect username or password specified.
 */
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
    var user = await getUserByName(data.username);

    // No user found
    if (! user) {
        return api_response(res, 401, "Unauthorized", []);
    }

    // Verify hash
    var matches = await argon2.verify(user.password, data.password);
    
    if (! matches) {
        return api_response(res, 401, "Unauthorized", []);
    }

    // Generate a new random token, and set the expiration time to 1 hour from now.
    user.token = crypto.randomBytes(64).toString('hex');
    user.token_expires_at = Date.now() + (1000 * 60 * 60 * 2);

    // Save this to the database 
    await user.save();

    // User logged in. Return username, auth token, and token expiration time
    return api_response(res, 200, "OK", {
        username: user.username,
        token: user.token,
        token_expires_at: user.token_expires_at,
        admin: user.admin
    });
});


/**
 * @api {put} /api/auth/changepassword Change password
 * @apiName Change password
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam {String} password Old password
 * @apiParam {string} new_password New password
 *
 * @apiSuccess {String} message Password changed successfully
 * 
 * @apiError InputValidationError The data input did not match the requirements.
 * @apiError Unauthorized Incorrect password.
 */
router.put('/changepassword', auth, async function(req, res) {
    const data = req.body;

    // Validate user input
    const schema = Joi.object({
        password: Joi.string().min(8).required(),
        new_password: Joi.string().min(8).required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }
    
    // Search for the user in the User table
    var user = await getUserByName(req.user.username);

    // No user found
    if (! user) {
        return api_response(res, 401, "Unauthorized", "");
    }

    // Verify hash
    var matches = await argon2.verify(user.password, data.password);

    // Incorrect password
    if (! matches) {
        return api_response(res, 401, "Unauthorized", "");
    }

    // Generate a new password hash
    user.password = await argon2.hash(data.new_password);

    // Clear tokens, forcing logout
    user.token = null;
    user.token_expires_at = null;

    // Save changes
    user.save();

    return api_response(res, 200, "OK", []);
});


/**
 * @api {post} /api/auth/logout Log out
 * @apiName Log out
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Authorization token
 */
router.post('/logout', auth, async function(req, res) {
    // Get user 
    var user = await getUserByName(req.user.username);

    // Clear the token
    user.token = null;
    user.token_expires_at = null;

    // Save changes
    user.save();

    return api_response(res, 200, "OK", []);
});

/**
 * @api {put} /api/auth/ping Renew token
 * @apiName Ping
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Authorization token
 */
router.put('/ping', auth, async (req, res) => {
    // Get user 
    let user = await getUserByName(req.user.username);

    // Add another hour to the token expiry time

    user.token_expires_at = Date.now() + (1000 * 60 * 60 * 2);

    user.save();

    return api_response(res, 200, "OK", {
        username: user.username,
        token: user.token,
        token_expires_at: user.token_expires_at,
        admin: user.admin
    });
});

module.exports = router;
