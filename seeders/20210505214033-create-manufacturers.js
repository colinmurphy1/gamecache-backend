'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const timestamp = new Date();

    await queryInterface.bulkInsert('Manufacturers', [
      {
        id: 1,
        name: 'Sony',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 2,
        name: 'Microsoft',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 3,
        name: 'Nintendo',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 4,
        name: 'Sega',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 5,
        name: 'Atari',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 6,
        name: 'Commodore',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Manufacturers', null, {});
  }
};
