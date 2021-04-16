// Load database
var db = require('../database/db.js');

// Finds a user account using their current authentication token, returning
// the sequelize model.
async function getUserByToken(token) {
    return await db.User.findOne({
        where: {
            token: token
        }
    })
    .then(function(model) {
        // Return the sequelize model
        return model;
    })
    .catch(function(error) {
        // Unable to find a user using the specified token
        return false;
    });
}

module.exports = getUserByToken;