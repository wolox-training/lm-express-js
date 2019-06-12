'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('purchases', 'updatedAt', 'updated_at'),

  down: queryInterface => queryInterface.renameColumn('purchases', 'updated_at', 'updatedAt')
};
