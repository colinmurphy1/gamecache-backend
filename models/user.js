'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    public_profile: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    token_expires_at: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};