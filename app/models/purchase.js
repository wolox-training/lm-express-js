'use strict';
const { databaseError } = require('../errors'),
  { getAlbumById } = require('../services/typicode');

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'purchase',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'album_id'
      }
    },
    { underscored: true }
  );
  /* Purchase.associate = function(models) {
    // associations can be defined here
  };*/

  Purchase.buyAlbumWithUserId = (userId, albumId) =>
    Purchase.findOrCreate({
      where: { userId, albumId }
    }).catch(error => databaseError(error.message));

  Purchase.findPurchase = (userId, albumId) =>
    Purchase.findOne({ where: { userId, albumId } }).catch(error => databaseError(error.message));

  Purchase.getAlbumsWithUserId = userId =>
    Purchase.findAll({ where: { userId }, attributes: ['albumId'] })
      .then(foundPurchases =>
        Promise.all(
          foundPurchases.map(purchase =>
            getAlbumById(purchase.albumId).then(album => ({ albumId: album.id, albumName: album.title }))
          )
        )
      )

      .catch(error => databaseError(error.message));

  Purchase.userHasAlbum = (userId, albumId) =>
    Purchase.findOne({ where: userId, albumId }).catch(error => databaseError(error.message));

  return Purchase;
};
