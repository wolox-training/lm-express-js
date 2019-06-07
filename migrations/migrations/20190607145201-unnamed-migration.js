'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'admin', {
      type: Sequelize.BOOLEAN
    }),

  down: queryInterface => queryInterface.removeColumn('Users', 'admin')
};
