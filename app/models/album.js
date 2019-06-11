'use strict';
const { databaseError } = require('../errors');
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'albums',
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

  Album.bougthAlbum = (userId, albumId) =>
    Album.findOrCreate({
      where: { userId, albumId }
    }).catch(error => databaseError(error.message));

  /* albums.associate = function(models) {
    // associations can be defined here
  };*/
  return Album;
};
