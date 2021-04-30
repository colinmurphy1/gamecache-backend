// Load modules
var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var auth_admin = require('../middleware/auth_admin.js');

// Load database
var db = require('../database/db.js');

var router = express.Router();


/**
 * @api {get} /api/device View all devices
 * @apiName View all devices
 * @apiGroup Device
 * 
 * @apiSuccess {Object} devices The list of devices, including their
 * ID, name, etc.
 */
router.get('/', async function(req, res) {
    var devices = await db.Device.findAll({
        include: {
            model: db.Manufacturer,
            attributes: ['id', 'name']
        },
        attributes: {
            exclude: ['ManufacturerId']
        }
    });
    return api_response(res, 200, "OK", devices);
});

/**
 * @api {post} /api/device Add a device
 * @apiName Add a device
 * @apiGroup Device
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization Authorization token
 * 
 * @apiParam {Number} name Name of the device
 * @apiParam {String=..10} shortname Short (<10 char) name of the device
 * @apiParam {Number} manufacturer Manufacturer ID number
 * 
 * @apiSuccess {String} name Device name
 * @apiSuccess {String} shortname Device shortname
 * @apiSuccess {Number} id Device ID
 * 
 * @apiError InputValidationError The passed data is incorrect
 * @apiError AddDeviceFailed Unable to add device to database
 */
router.post('/', auth_admin, async function(req, res) {
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
    var createDevice = await db.Device.create({
        name: data.name,
        shortname: data.shortname,
        ManufacturerId: data.manufacturer,
        year: data.year
    }).then(function(value) {
        // Device creation successful
        return value;
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
        "id": createDevice.id,
        "name": data.name,
        "shortname": data.shortname
    });
});

module.exports = router;
