'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const timestamp = new Date();

    await queryInterface.bulkInsert('Devices', [
      {
        id: 1,
        name: 'PlayStation',
        shortname: 'PS1',
        year: 1996,
        ManufacturerId: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 2,
        name: 'PlayStation 2',
        shortname: 'PS2',
        year: 2000,
        ManufacturerId: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 3,
        name: 'PlayStation 3',
        shortname: 'PS3',
        year: 2006,
        ManufacturerId: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 4,
        name: 'PlayStation 4',
        shortname: 'PS4',
        year: 2013,
        ManufacturerId: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 5,
        name: 'PlayStation 5',
        shortname: 'PS5',
        year: 2020,
        ManufacturerId: 1,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 6,
        name: 'Windows',
        shortname: 'WIN',
        year: 1996,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 7,
        name: 'MS-DOS',
        shortname: 'DOS',
        year: 1980,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 8,
        name: 'Xbox',
        shortname: 'XBOX',
        year: 2000,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 9,
        name: 'Xbox 360',
        shortname: 'XB360',
        year: 2005,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 10,
        name: 'Xbox One',
        shortname: 'XBOne',
        year: 2013,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 11,
        name: 'Xbox Series X,S',
        shortname: 'XBSX',
        year: 2020,
        ManufacturerId: 2,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 12,
        name: 'Genesis',
        shortname: 'SGEN',
        year: 1989,
        ManufacturerId: 4,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 13,
        name: 'Dreamcast',
        shortname: 'SGC',
        year: 1998,
        ManufacturerId: 4,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 14,
        name: 'Nintendo Entertainment System',
        shortname: 'NES',
        year: 1983,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 15,
        name: 'Super Nintendo',
        shortname: 'SNES',
        year: 1990,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 16,
        name: 'Nintendo 64',
        shortname: 'N64',
        year: 1996,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 17,
        name: 'GameCube',
        shortname: 'GC',
        year: 2001,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 18,
        name: 'Wii',
        shortname: 'Wii',
        year: 2006,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 19,
        name: 'Nintendo DS',
        shortname: 'NDS',
        year: 2004,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 20,
        name: 'Nintendo Switch',
        shortname: 'Switch',
        year: 2017,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 21,
        name: 'Wii U',
        shortname: 'WiiU',
        year: 2012,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 22,
        name: 'GameBoy',
        shortname: 'GB',
        year: 1989,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 23,
        name: 'GameBoy Color',
        shortname: 'GBC',
        year: 1998,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 24,
        name: 'GameBoy Advance',
        shortname: 'GBA',
        year: 2001,
        ManufacturerId: 3,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      {
        id: 25,
        name: 'Atari 2600',
        shortname: 'A2600',
        year: 1977,
        ManufacturerId: 5,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Devices', null, {});
  }
};
