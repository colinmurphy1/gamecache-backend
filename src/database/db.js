require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);


/*
    Define models
*/

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/User')(sequelize, Sequelize);
db.Manufacturer = require('../models/Manufacturer')(sequelize, Sequelize);
db.Device = require('../models/Device')(sequelize, Sequelize);
db.Game = require('../models/Game')(sequelize, Sequelize);
db.UserGame = require('../models/UserGame')(sequelize, Sequelize);


/*
    Database associations
*/

// Manufacturer has many Devices
db.Manufacturer.hasMany(db.Device);
db.Device.belongsTo(db.Manufacturer);

// A Device has many Games
db.Device.hasMany(db.Game);
db.Game.belongsTo(db.Device);

// M-M relationship for game collection
db.User.belongsToMany(db.Game, { through: "UserGame" });
db.Game.belongsToMany(db.User, { through: "UserGame" });


// Sync database models
db.sequelize.sync({force:true});

module.exports = db;
