// Import modules
require('dotenv').config();
const path = require('path');
const csv = require('fast-csv');
const glob = require('glob');

// Import database
var db = require('../src/database/db.js');


// Returns the device ID from the specified shortname
async function getDeviceIdFromShortName(shortname) {

  const device = await db.Device.findOne({
    where: {
      shortname: shortname
    },
    logging: false
  }).then(function(model) {
    return model;
  })
  .catch(function(error) {
    console.log(error);
    return false;
  });
  
  return device.id;
}

async function main(csvDir) {
  // get list of csv files
  const basepath = path.resolve(csvDir) + "/**/*.csv";
  const files = glob.sync(basepath);

  // data to bulk insert is stored in this array
  let csvData = [];

  for (const file of files) {
    // Device name is the last directory in the file path
    const deviceName = path.dirname(file).match(/[^\/]+$/)[0];
    const deviceId = await getDeviceIdFromShortName(deviceName);

    console.log(`\nImporting file "${file}" to device "${deviceName}"\n`);

    // Open CSV file
    await csv.parseFile(file, {headers: true})
      .on('data', (row) => {
        csvData.push({
          title: row['Title'],
          publisher: row['Developer'],
          year: row['Released'],
          DeviceId: deviceId
        });
      })

    // Insert data
    await db.Game.bulkCreate(csvData)
      .catch((error) => {
        console.log(error);
      });
    
    // Reset array
    csvData = [];
  }

  // Close db connection
  await db.sequelize.close();

}

if (process.argv[2] == null) {
  console.log('Please specify a directory containing game CSV files')
  return 1;
}

main(process.argv[2]);
