module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserGame', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Optional game notes
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Optional rating
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        }
    });
}