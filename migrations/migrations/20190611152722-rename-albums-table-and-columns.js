'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameTable('albums', 'purchases'),
  down: queryInterface => queryInterface.renameTable('purchases', 'albums')
};

module.exports = {
  up: queryInterface =>
    Promise.all([
      queryInterface.renameTable('albums', 'purchases'),
      queryInterface.renameColumn('purchases', 'albumId', 'album_id'),
      queryInterface.renameColumn('purchases', 'userId', 'user_id'),
      queryInterface.renameColumn('purchases', 'createdAt', 'created_at'),
      queryInterface.renameColumn('purchases', 'updatedAt', 'updated_at')
    ]),
  down: queryInterface =>
    Promise.all([
      queryInterface.renameTable('purchases', 'albums'),
      queryInterface.renameColumn('purchases', 'album_id', 'albumId'),
      queryInterface.renameColumn('purchases', 'user_id', 'userId'),
      queryInterface.renameColumn('purchases', 'created_at', 'createdAt'),
      queryInterface.renameColumn('purchases', 'updated_at', 'updatedAt')
    ])
};
