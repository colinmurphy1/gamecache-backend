module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Manufacturer', {
        // Manufacturer name
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}
