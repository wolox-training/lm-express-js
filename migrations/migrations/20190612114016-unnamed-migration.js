'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('purchases', 'albumId', 'album_id'),

  down: queryInterface => queryInterface.renameColumn('purchases', 'album_id', 'albumId')
};
