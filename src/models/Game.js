const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');
const Device = require('./Device.js');


const Game = sequelize.define('Game', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// A device has many games
Device.hasMany(Game);
Game.belongsTo(Device);

//Game.sync();

module.exports = Game;