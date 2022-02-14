'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      PublisherId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Publishers',
          key: 'id'
        },
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      DeviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Devices',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Games');
  }
};