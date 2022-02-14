// Load modules
var express = require('express');
const Joi = require('joi');
const { Op } = require('sequelize');

var api_response = require('../lib/response');
var auth_admin = require('../middleware/auth_admin.js');
var getGameById = require('../lib/getGameById');

// Load database
var db = require('../database/db.js');

var router = express.Router();

/**
 * @api {get} /api/publisher View all publishers
 * @apiName View all publishers
 * @apiGroup Game
 * 
 * @apiSuccess {Object} data The resulting list of publishers
 * 
 * @apiError PublisherLoadError Could not retrieve the list of publishers
 */
router.get('/', async (req, res) => {
  // Find all publishers
  const publisher = await db.Publisher.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
      order: ['id']
    }
  })
  .then((value) => value)
  .catch((error) => false)

  if(!publisher) {
    return api_response(res, 500, "PublisherLoadError", []);
  }

  // Return publishers
  return api_response(res, 200, "OK", publisher);
})



router.post('/', async (req, res) => {
  const data = req.body;

  // Validate inputs
  const schema = Joi.object({
    name: Joi.string().required(),
  })
  const {error, value} = schema.validate(data, {abortEarly: false});

  // Check for validation errors, and print if any exist
  if (error) {
    return api_response(res, 400, "InputValidationError", value);
  }

  var createPublisher = await db.Publisher.create({
    name: data.name
  }).then(function(value) {
    // Publisher creation successful
    return value;
  })
  .catch(function(error) {
    // Error encountered while creating publisher
    return false;
  });

  if (! createPublisher) {
    return api_response(res, 500, "AddPublisherFailed", {});
  }

  // Return api response
  return api_response(res, 200, "OK", {
    "name": data.name,
    "publisherId": createPublisher.id
  })

});


module.exports = router;