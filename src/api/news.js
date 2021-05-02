var express = require('express');
const Joi = require('joi');

var api_response = require('../lib/response');
var auth_admin = require('../middleware/auth_admin.js');

var db = require('../database/db.js');

var router = express.Router();

/**
 * @api {post} /api/news Post news article
 * @apiName New article
 * @apiGroup News
 * @apiHeader {String} Authorization Authorization token
 * @apiPermission admin
 * 
 * @apiParam {String} title Title of the news article
 * @apiParam {String} content Content of the post. Can be in plain text or
 * markdown.
 * 
 * @apiError InputValidationError Incorrect data passed
 * @apiError CreationError Could not create post
 */
router.post('/', auth_admin, async function(req, res) {
    const data = req.body;

    // Validate user input
    const schema = Joi.object({
        // Title
        title: Joi.string().required(),
        // Post content
        content: Joi.string().required()
    });

    const {error, value} = schema.validate(data, {abortEarly: false});

    if (error) {
        return api_response(res, 400, "InputValidationError", value);
    }

    // Create news article
    const newArticle = await db.NewsPost.create({
        title: data.title,
        content: data.content,
        UserId: req.user.id
    })
    .then((model) => model)
    .catch((error) => false);

    // Could not create the post
    if (! newArticle) {
        return api_response(res, 500, "CreationError", []);
    }

    return api_response(res, 200, "OK", {
        "id": newArticle.id,
        "title": newArticle.title
    });
});


/**
 * @api {get} /api/news Get news articles
 * @apiName Get Articles
 * @apiGroup News
 * 
 * @apiError RetrievalError Could not load any posts
 */
router.get('/', async function(req, res) {

    const newsPosts = await db.NewsPost.findAll({
        include: {
            model: db.User,
            attributes: ['id', 'username']
        },
        attributes: {
            exclude: ['UserId']
        },
        // Show the newest posts first
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .then((model) => model)
    .catch((error) => {
        return false
    });

    if (! newsPosts) {
        return api_response(res, 200, "RetrievalError", []);
    }

    return api_response(res, 200, "OK", newsPosts);
});

// Delete news article
router.delete('/:postid', auth_admin, async function(req, res) {
    const postId = req.params['postid'];

    // Find post
    const deletePost = await db.NewsPost.findOne({
        where: {
            id: postId
        }
    })
    .then((model) => model)
    .catch((error) => false);

    // News post does not exist
    if (! deletePost) {
        return api_response(res, 404, "NotFound", []);
    }

    // Delete the post
    deletePost.destroy();

    return api_response(res, 200, "OK", {
        "id": deletePost.id,
        "title": deletePost.title
    });

});

module.exports = router;
