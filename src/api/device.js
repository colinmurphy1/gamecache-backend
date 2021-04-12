// Load modules
var express = require('express');
var api_response = require('../lib/response');

// Load database
var Game = require('../models/Game.js');
var Device = require('../models/Device.js');
var Manufacturer = require('../models/Manufacturer.js');

var router = express.Router();


// Device (console) list
router.get('/', async function(req, res) {
    var consoles = await Device.findAll();
    return api_response(res, 200, "OK", consoles);
});

// Manufacturer list
router.get('/manufacturer', async function(req, res) {
    var manufacturer = await Manufacturer.findAll();
    return api_response(res, 200, "OK", manufacturer);
});


// Add device (this will be admin only)
router.post('/', async function(req, res) {

    // TODO: Don't allow submissions if fields are missing
    const data = req.body;

    // Create a new device
    var createDevice = await Device.create({
        name: data.name,
        shortname: data.shortname,
        ManufacturerId: data.manufacturer,
        year: data.year
    }).then(function(value) {
        // Device creation successful
        return true;
    })
    .catch(function(error) {
        // Error encountered while creating device
        return false;
    });

    if (! createDevice) {
        return api_response(res, 500, "AddDeviceFailed", {
            "message": "Could not add device"
        });
    }

    return api_response(res, 200, "OK", {
        "message": `Added ${data.name} to device database.`
    });
});


// Add manufacturer (this will be admin only)
router.post('/manufacturer', async function(req, res) {
    const data = req.body;

    var createManufacturer = await Manufacturer.create({
        name: data.name
    }).then(function(value) {
        // Manufacturer creation successful
        return true;
    })
    .catch(function(error) {
        // Error encountered while creating device
        return false;
    });

    if (! createManufacturer) {
        return api_response(res, 500, "AddManufacturerFailed",
        {
            "message": "Could not add manufacturer"
        });
    }

    return api_response(res, 200, "OK", {
        "message": `Added ${data.name} to manufacturer database.`
    });
});


module.exports = router;
