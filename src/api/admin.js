const express = require('express');
const Joi = require('joi');
const api_response = require('../lib/response');
const getUserByName = require('../lib/getUserByName');
const db = require('../database/db.js');
const auth_admin = require('../middleware/auth_admin');

const router = express.Router();

/**
 * @api {put} /api/admin/setstatus Enable/Disable user
 * @apiName Enable/Disable User
 * @apiGroup Authentication
 * @apiHeader {String} Authorization Authorization token
 */
router.put('/setstatus', auth_admin, async (req, res) => {
    const data = req.body;

    // Get user 
    const user = await getUserByName(data.username);

    if (!user) {
        return api_response(res, 404, "UserNotFound", {
            message: `${data.username} is not a valid user.`
        });
    }

    // Prevent locking yourself out
    if (user.username == req.user.username) {
        return api_response(res, 400, "Denied", {
            message: "You cannot disable your own account."
        });
    }

    // Disable and log out the user if enabled
    if (user.enabled) {
        // Disable user
        user.enabled = false;
        // Force logout
        user.token_expires_at = Date.now();
    }
    else {
        // Enable user
        user.enabled = true;
    }

    // Save changes
    user.save();

    return api_response(res, 200, "OK", {
        username: user.username,
        enabled: user.enabled 
    });
});


router.get('/users', auth_admin, async (req, res) => {
    const token = req.user.token;

    // Get all users, ignoring account status
    const getUsers = await db.User.findAll({
        attributes: {
            exclude: [
                'password', 'token', 'bio', 'createdAt', 'updatedAt'
            ]
        }
    })
    .then((model) => model)
    .catch((error) => {
        console.log(error);
        return false;
    });

    // Could not load users, return response
    if (! getUsers) {
        return api_response(res, 500, "UserLoadError", {});
    }


    // Create an array of users
    let userList = [];

    for (user of getUsers) {
        userList.push({
            id: user.id,
            username: user.username,
            email: user.email,
            enabled: user.enabled,
            admin: user.admin,
            online: user.token_expires_at > Date.now(),
            public_profile: user.public_profile
        })
    }

    // Return an array of users
    return api_response(res, 200, "OK", userList);
});


module.exports = router;
