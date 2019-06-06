'use strict';
const { databaseError, validationError } = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { underscored: true }
  );

  User.createUser = (firstName, lastName, email, password) =>
    User.findOrCreate({
      where: { email },
      defaults: {
        firstName,
        lastName,
        password
      }
    }).catch(error => databaseError(error.message));

  User.findUserByEmail = email =>
    User.findOne({ where: { email } }).catch(error => databaseError(error.message));

  User.getUsers = (offset, limit) =>
    User.findAndCountAll({ attributes: ['firstName', 'lastName', 'email'], offset, limit }).catch(error =>
      databaseError(error.message)
    );

  User.getUserPassword = user => {
    if (user) {
      return user.password;
    }
    throw validationError("user must be valid. It can't be null");
  };
  /* User.associate = function(models) {
    // associations can be defined here
  };*/
  return User;
};
