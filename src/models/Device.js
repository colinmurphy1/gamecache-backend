const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');

const Manufacturer = require('./Manufacturer.js');

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

    // Console year
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// A Manufacturer has many Devices, but a Device only has one Manufacturer
Manufacturer.hasMany(Device);
Device.belongsTo(Manufacturer);

//Device.sync();

module.exports = Device;
