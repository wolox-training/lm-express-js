'use strict';

module.exports = {
  up: queryInterface => queryInterface.renameColumn('purchases', 'userId', 'user_id'),

  down: queryInterface => queryInterface.renameColumn('purchases', 'user_id', 'userId')
};
