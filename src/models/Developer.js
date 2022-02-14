module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Developers', {
        // Developer name
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}
