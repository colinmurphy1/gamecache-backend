'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'UserGames',
      'status',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserGames', 'status');
  }
};