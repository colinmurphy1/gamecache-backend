const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');

// Device/Console
const Device = sequelize.define('Device', {
    // Console name (eg. PlayStation 3)
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Short name (eg. PS3)
    shortname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    // Console manufacturer
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Console year
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


//Device.sync();

module.exports = Device;
