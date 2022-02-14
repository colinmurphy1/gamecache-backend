module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Game', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        developerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}
