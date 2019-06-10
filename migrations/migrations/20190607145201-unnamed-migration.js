'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'is_admin', {
      type: Sequelize.BOOLEAN
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'is_admin')
};
