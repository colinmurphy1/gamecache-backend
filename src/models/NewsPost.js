module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NewsPost', {
        // News post title
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}

