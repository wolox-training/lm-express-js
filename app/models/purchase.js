'use strict';
const { databaseError } = require('../errors');
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'purchases',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );

  Purchase.bougthAlbum = (userId, albumId) =>
    Purchase.findOrCreate({
      where: { userId, albumId }
    }).catch(error => databaseError(error.message));

  /* albums.associate = function(models) {
    // associations can be defined here
  };*/
  return Purchase;
};
