module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserGame', {
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
}