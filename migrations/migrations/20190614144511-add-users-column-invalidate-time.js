'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'invalidate_time', {
      type: Sequelize.INTEGER
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'invalidate_time')
};
