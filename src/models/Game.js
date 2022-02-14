module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Game', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}
