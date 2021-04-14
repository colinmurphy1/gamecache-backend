// Load modules
var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var auth_admin = require('../middleware/auth_admin.js');

// Load database
var Manufacturer = require('../models/Manufacturer.js');


var router = express.Router();

// Manufacturer list
router.get('/', async function(req, res) {
    var manufacturer = await Manufacturer.findAll();
    return api_response(res, 200, "OK", manufacturer);
});


// Add manufacturer (Admin only)
router.post('/', auth_admin, async function(req, res) {
    const data = req.body;

    // Verify that all required data is passed
    const schema = Joi.object({
        name: Joi.string().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

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
