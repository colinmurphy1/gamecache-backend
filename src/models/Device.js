module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Device', {
        // Console name (eg. PlayStation 3)
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        // Short name (eg. PS3)
        shortname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        // Console year
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}

