module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Publishers', {
        // Publisher name
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}
