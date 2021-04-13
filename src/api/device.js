// Load modules
var express = require('express');
const Joi = require('joi');
var api_response = require('../lib/response');

// Load database
var Device = require('../models/Device.js');


var router = express.Router();


// Device (console) list
router.get('/', async function(req, res) {
    var consoles = await Device.findAll();
    return api_response(res, 200, "OK", consoles);
});

// Add device (this will be admin only)
router.post('/', async function(req, res) {
    const data = req.body;

    // Verify that all required data is passed
    const schema = Joi.object({
        name: Joi.string().required(),
        shortname: Joi.string().alphanum().max(10).required(),
        manufacturer: Joi.number().required(),
        year: Joi.number().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }


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

module.exports = router;
