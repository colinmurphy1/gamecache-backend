var api_response = require('../lib/response');

var db = require('../database/db.js');

async function auth_admin(req, res, next) {
    // Get Authorization HTTP header
    var token = req.header('Authorization');

    // If no token is given, give http 401
    if (token === undefined) {
        return api_response(res, 401, "UnauthorizedError", "");
    }

    // Grab token from DB
    var user = await db.User.findOne({
        where: {
            token: token
        }
    }).then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false;
    });

    // No users have this token, token is invalid
    if (! user) {
        return api_response(res, 404, "InvalidTokenError", "");
    }

    // Check if the token has expired
    if (user.token_expires_at < Date.now()) {
        return api_response(res, 401, "ExpiredTimestamp", "");
    }

    // Check if user is an administrator
    if (! user.admin) {
        return api_response(res, 403, "AccessDenied", "");
    }

    next();
}

module.exports = auth_admin;