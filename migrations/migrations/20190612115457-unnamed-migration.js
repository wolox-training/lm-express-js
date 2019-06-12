'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('purchases', 'createdAt', 'created_at'),

  down: queryInterface => queryInterface.renameColumn('purchases', 'created_at', 'createdAt')
};
