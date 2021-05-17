// load database
var db = require('../database/db.js');

// This function returns the Game module by specifying a game ID. Returns
// false when the game is not found.
async function getGameById(gameId) {
    return await db.Game.findOne({
        where: {
            id: gameId
        },
        include: {
            model: db.Device,
            attributes: ['id', 'name', 'shortname']
        }
        ,attributes: {
            exclude: ['DeviceId']
        }
    }).then(function(model) {
        return model;
    })
    .catch(function(error) {
        return false;
    });
}

module.exports = getGameById;