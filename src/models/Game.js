const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');


const Game = sequelize.define('Game', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    device: {
        type: DataTypes.INTEGER,
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

//Game.sync();

module.exports = Game;