'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameTable('albums', 'purchases'),
  down: queryInterface => queryInterface.renameTable('purchases', 'albums')
};
