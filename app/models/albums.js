'use strict';
module.exports = (sequelize, DataTypes) => {
  const albums = sequelize.define(
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
  /* albums.associate = function(models) {
    // associations can be defined here
  };*/
  return albums;
};
