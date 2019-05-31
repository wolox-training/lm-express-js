'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameTable('Users', 'users'),
  down: queryInterface => queryInterface.renameTable('users', 'Users')
};
