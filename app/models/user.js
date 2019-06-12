'use strict';
const { databaseError } = require('../errors');

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
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    { underscored: true }
  );

  User.createUser = ({ firstName, lastName, email, password, isAdmin = false }) =>
    User.findOrCreate({
      where: { email },
      defaults: {
        firstName,
        lastName,
        password,
        isAdmin
      }
    }).catch(error => databaseError(error.message));

  User.findUserByEmail = email =>
    User.findOne({ where: { email } }).catch(error => databaseError(error.message));

  User.getUsers = (offset, limit) =>
    User.findAndCountAll({ attributes: ['firstName', 'lastName', 'email'], offset, limit })
      .then(response => ({ count: response.count, users: response.rows }))
      .catch(error => databaseError(error.message));

  User.makeAdmin = email =>
    User.update({ isAdmin: true }, { where: { email } }).catch(error => databaseError(error.message));

  User.getUserById = id => User.findOne({ where: { id } }).catch(error => databaseError(error.message));
  /* User.associate = function(models) {
    // associations can be defined here
  };*/
  return User;
};
