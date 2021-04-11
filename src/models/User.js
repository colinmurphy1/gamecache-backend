const { DataTypes } = require('sequelize');

var sequelize = require('../database/db.js');

const User = sequelize.define('User', {
    // Username, primary authentication method
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Username must be unique
    },

    // Email, will be used for password recoveries, etc..
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    
    // Hashed password
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Denotes if the users' profile is public
    public_profile: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },

    // Login tokens
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // Defines an administrator account
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // Optional biography for your profile
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

//User.sync();

module.exports = User;
