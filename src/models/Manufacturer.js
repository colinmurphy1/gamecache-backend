const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');

// Device/Console Manufacturer
const Manufacturer = sequelize.define('Manufacturer', {
    // Manufacturer name
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});


//Manufacturer.sync();

module.exports = Manufacturer;
