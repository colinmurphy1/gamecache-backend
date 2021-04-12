// Load modules
var express = require('express');
var api_response = require('../lib/response');

// Load database
var Device = require('../models/Device.js');
var Manufacturer = require('../models/Manufacturer.js');

var router = express.Router();

// Manufacturer list
router.get('/', async function(req, res) {
    var manufacturer = await Manufacturer.findAll();
    return api_response(res, 200, "OK", manufacturer);
});


// Add manufacturer (this will be admin only)
router.post('/', async function(req, res) {
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
