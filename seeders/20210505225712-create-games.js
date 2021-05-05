'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const timestamp = new Date();

    await queryInterface.bulkInsert('Games', [
      {
        title: 'Half-Life',
        publisher: 'Valve Software',
        year: 1998,
        DeviceId: 6, // pc
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Half-Life 2',
        publisher: 'Valve Software',
        year: 2004,
        DeviceId: 6,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Grand Theft Auto IV',
        publisher: 'Rockstar Games',
        year: 2008,
        DeviceId: 3, // ps3
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Grand Theft Auto IV',
        publisher: 'Rockstar Games',
        year: 2008,
        DeviceId: 6, // pc
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Doom',
        publisher: 'id Software',
        year: 1993,
        DeviceId: 7, //ms-dos
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Black Mesa',
        publisher: 'Crowbar Collective',
        year: 2008,
        DeviceId: 6,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Mario Bros',
        publisher: 'Nintendo',
        year: 1983,
        DeviceId: 14,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'The Legend of Zelda',
        publisher: 'Nintendo',
        year: 1986,
        DeviceId: 14,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Pac-Man',
        publisher: 'Namco',
        year: 1980,
        DeviceId: 25,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Space Invaders',
        publisher: 'Taito',
        year: 1978,
        DeviceId: 25,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        title: 'Asteroids',
        publisher: 'Atari',
        year: 1979,
        DeviceId: 25,
        createdAt: timestamp,
        updatedAt: timestamp
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Games', null, {});
  }
};
