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
 * @api {get} /api/developer View all developers
 * @apiName View all developers
 * @apiGroup Game
 * 
 * @apiSuccess {Object} data The resulting list of game developers
 * 
 * @apiError DeveloperLoadError Could not retrieve the list of game developers
 */
router.get('/', async (req, res) => {
  // Find all developers
  const developer = await db.Developer.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
      order: ['id']
    }
  })
  .then((value) => value)
  .catch((error) => false)

  if(!developer) {
    return api_response(res, 500, "DeveloperLoadError", []);
  }

  // Return developer
  return api_response(res, 200, "OK", developer);
})



router.post('/', auth_admin, async (req, res) => {
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

  var createDeveloper = await db.Developer.create({
    name: data.name
  }).then(function(value) {
    // Developer creation successful
    return value;
  })
  .catch(function(error) {
    // Error encountered while creating Developer
    return false;
  });

  if (! createDeveloper) {
    return api_response(res, 500, "AddDeveloperFailed", {});
  }

  // Return api response
  return api_response(res, 200, "OK", {
    "name": data.name,
    "developerId": createDeveloper.id
  })

});


module.exports = router;