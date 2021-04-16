const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');

const User = require('./User.js');
const Game = require('./Game.js');

const UserGame = sequelize.define('UserGame', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Optional game notes
    game_notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    game_rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    }

});



User.belongsToMany(Game, { through: UserGame });
Game.belongsToMany(User, { through: UserGame });


//UserGame.sync();

module.exports = UserGame;