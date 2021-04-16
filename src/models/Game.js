module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Game', {
        title: {
            type: DataTypes.STRING,
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
}
