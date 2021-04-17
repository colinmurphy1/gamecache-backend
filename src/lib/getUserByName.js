// load database
var db = require('../database/db.js');

// This function returns the User module by specifying a username. Returns
// false when the user is not found.
async function getUserByName(username) {
    return await db.User.findOne({
        where: {
            username: username
        }
    }).then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false;
    });
}

module.exports = getUserByName;