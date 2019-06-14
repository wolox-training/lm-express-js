'use strict';

module.exports = {
  up: queryInterface =>
    queryInterface
      .renameTable('albums', 'purchases')
      .then(() =>
        Promise.all([
          queryInterface.renameColumn('purchases', 'albumId', 'album_id'),
          queryInterface.renameColumn('purchases', 'userId', 'user_id'),
          queryInterface.renameColumn('purchases', 'createdAt', 'created_at'),
          queryInterface.renameColumn('purchases', 'updatedAt', 'updated_at')
        ])
      ),

  down: queryInterface =>
    queryInterface
      .renameTable('purchases', 'albums')
      .then(() =>
        Promise.all([
          queryInterface.renameColumn('albums', 'album_id', 'albumId'),
          queryInterface.renameColumn('albums', 'user_id', 'userId'),
          queryInterface.renameColumn('albums', 'created_at', 'createdAt'),
          queryInterface.renameColumn('albums', 'updated_at', 'updatedAt')
        ])
      )
};
